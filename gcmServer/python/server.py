#!/usr/bin/python

import json
import os
import pickle
import random
import string
import sys
import time
import xmpp

################################################################################

SERVER = 'gcm.googleapis.com'
PORT = 5235

# TODO: is 4k correct?
GCM_MSG_SIZE = 4096
MAX_GCM_MSG_LEN = GCM_MSG_SIZE - 300 # Buffer, just in case

server_dir = os.path.dirname(__file__)
state_file = os.path.join(server_dir, "server.state")
auth_file = os.path.join(server_dir, '../gcm_auth_info.json')
unacked_messages_quota = 1000
send_queue = None
client = None
users = None

################################################################################

class Users(object):
    def __init__(self):
        self.users_ = []
        self.next_short_id_ = 0

    def add(self, regid, name):
        self.users_.append({
            "regid": regid,
            "shortid": str(self.next_short_id_),
            "name": name,
            "last_use": time.time()
        })
        self.next_short_id_ += 1

    def get_by_regid(self, regid):
        ans = filter(lambda user: user["regid"] == regid, self.users_)
        return (ans and ans[0]) or None

    def get_by_shortid(self, shortid):
        ans = filter(lambda user: user["shortid"] == shortid, self.users_)
        return (ans and ans[0]) or None

    def update_usage_time(self, regid):
        self.get_by_regid(regid)["last_use"] = time.time()

    def get_user_list_as_json_no_more_than_4k_chars(self, exclude_regid):
        ans = filter(lambda user: user["regid"] != exclude_regid, self.users_) # deep copy of filter is important
        ans.sort(key = lambda user: user["last_use"], reverse = True) # sorted by use
        ans = map(lambda user: (user["shortid"], user["name"]), ans) # project only id and name
        while len(json.dumps(ans)) > MAX_GCM_MSG_LEN: # take only most recent that fit within gcm msg budget.
            ans.pop()
        ans.sort(key = lambda user: user[0], reverse = False) # final sort by shortid, so names don't bounce around
        return json.dumps(ans)

    def get_all_regid(self):
        return map(lambda user: user["regid"], self.users_)

################################################################################

def SaveAppState():
  with open(state_file, 'wb') as f:
    pickle.dump([users, send_queue], f)

def sendMessage(to, data):
  # Return a random alphanumerical id
  chars = string.ascii_letters + string.digits
  rid = ''.join(random.choice(chars) for i in range(8))

  send_queue.append({
    'to': to,
    'message_id': rid,
    'data': data
  })

################################################################################

def sendAck(msg):
  sendRaw({
    'to': msg['from'],
    'message_type': 'ack',
    'message_id': msg['message_id']
  })

################################################################################

def sendRaw(json_dict):
  template = "<message><gcm xmlns='google:mobile:data'>{1}</gcm></message>"
  content = template.format(client.Bind.bound[0], json.dumps(json_dict))
  client.send(xmpp.protocol.Message(node = content))

################################################################################

def flushQueuedMessages():
  global unacked_messages_quota
  while len(send_queue) and unacked_messages_quota > 0:
    sendRaw(send_queue.pop(0))
    unacked_messages_quota -= 1
  SaveAppState()

################################################################################

def messageCallback(session, message):
  global unacked_messages_quota
  gcm = message.getTags('gcm')
  if not gcm:
    return
  msg = json.loads(gcm[0].getData())

  # If this just an ACK/NACK message from the gcm server, don't actually handle the payload
  if msg.has_key('message_type') and (msg['message_type'] == 'ack' or msg['message_type'] == 'nack'):
    # TODO: Do we need to do something special for nack?
    unacked_messages_quota += 1
    return

  # Okay, this is a message from a client. First things first, we have to send ACK to gcm server that we got it
  sendAck(msg)

  handleMessageInApplicationSpecificManner(msg)
  SaveAppState()

################################################################################

def handlePingMessage(msg, payload):
  # Reply with same message
  sendMessage(msg['from'], { 'type': 'pong', 'message': payload['message'] })

def sendUpdatedListOfClientsTo(regid):
  sendMessage(regid, {
    'type': 'userListChangeEh',
    'users': users.get_user_list_as_json_no_more_than_4k_chars(regid)
  })

def identifySelfEh(msg, payload):
  regid = msg["from"]
  name = payload["name"]

  # if this user is already in the list, just remind them of the userlist
  user = users.get_by_regid(regid)
  if user and user["name"] == name:
    return sendUpdatedListOfClientsTo(regid)

  # if this user is not in the list, or has changed names, update everyones userlist
  if user:
      user["name"] = name
      users.update_usage_time(regid)
  else:
      users.add(regid, name)

  for regid in users.get_all_regid():
    sendUpdatedListOfClientsTo(regid)

def remindMeAgainEh(msg, payload):
  users.update_usage_time(msg["from"])
  sendUpdatedListOfClientsTo(msg["from"])

def sendEh(msg, payload):
  users.update_usage_time(msg["from"])
  from_user = users.get_by_regid(msg["from"])
  to_user = users.get_by_shortid(payload["to_userid"])

  sendMessage(to_user["regid"], {
    'type': 'incomingEh',
    'from_userid': from_user["shortid"]
  })

################################################################################

def handleMessageInApplicationSpecificManner(msg):
  payload = msg['data']
  # payload['type'] is not a requirement, its just a convention I chose to use

  handlers = {
    'ping': handlePingMessage,
    'identifySelfEh': identifySelfEh,
    'remindMeAgainEh': remindMeAgainEh,
    'sendEh': sendEh
  }

  if not payload.has_key('type') or not handlers.has_key(payload['type']):
    print "WARN: Do not know how to handle this message:"
    print json.dumps(payload, indent=2)
    return

  handler = handlers[payload['type']]
  try:
    handler(msg, payload)
  except Exception as e:
    print "Handler of type " + payload['type'] + " had a meltdown:"
    print e
    import traceback
    traceback.print_exc()

################################################################################

def main():
  global client, users, send_queue
  client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
  client.connect(server=(SERVER, PORT), secure=1, use_srv=False)

  # TODO: support command line args for auth info / path to file
  with open(auth_file) as json_data:
    authData = json.load(json_data)
  auth = client.auth(authData['username'], authData['password'])

  if not auth:
    print 'Authentication failed!'
    sys.exit(1)

  try:
    with open(state_file, "rb") as f:
      users, send_queue = pickle.load(f)
  except:
    users, send_queue = Users(), []

  client.RegisterHandler('message', messageCallback)

  while True:
    client.Process(1)
    flushQueuedMessages()

################################################################################

if __name__ == '__main__':
  main()
