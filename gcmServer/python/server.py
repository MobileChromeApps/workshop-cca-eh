#!/usr/bin/python
import sys, json, random, string
import xmpp

################################################################################

SERVER = 'gcm.googleapis.com'
PORT = 5235

unacked_messages_quota = 1000
send_queue = []
client = None

connected_users = {}

################################################################################

# Return a random alphanumerical id
def random_id():
  chars = string.ascii_letters + string.digits
  rid = ''.join(random.choice(chars) for i in range(8))
  return rid

################################################################################

def sendMessage(to, data):
  send_queue.append({
    'to': to,
    'message_id': random_id(),
    'data': data
  })

################################################################################

def send(json_dict):
  template = "<message><gcm xmlns='google:mobile:data'>{1}</gcm></message>"
  content = template.format(client.Bind.bound[0], json.dumps(json_dict))
  client.send(xmpp.protocol.Message(node = content))

################################################################################

def flush_queued_messages():
  global unacked_messages_quota
  while len(send_queue) and unacked_messages_quota > 0:
    send(send_queue.pop(0))
    unacked_messages_quota -= 1

################################################################################

def message_callback(session, message):
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
  send({
    'to': msg['from'],
    'message_type': 'ack',
    'message_id': msg['message_id']
  })

  handleMessageInApplicationSpecificManner(msg)

################################################################################

def sendUpdatedListOfClientsTo(regid):
  send_queue.append({
    'to': regid,
    'message_id': random_id(),
    'data': {
      'type': 'userListChangeEh',
      'users': filter(lambda (r,n): r != regid, connected_users.items())
    }
  })

def handlePingMessage(msg, payload):
  # Reply with same message
  sendMessage(msg['from'], { 'type': 'pong', 'message': payload['message'] })

def identifySelfEh(msg, payload):
  # TODO: how to prune users? (Perhaps after they fail to ack a message?)
  regid = msg["from"]
  name = payload["name"]

  # if this user is already in the list, just remind them of the userlist
  if connected_users.has_key(regid) and connected_users[regid] == name:
    return sendUpdatedListOfClientsTo(regid)

  # if this user is not in the list, or has changed names, update everyones userlist
  connected_users[regid] = name
  for regid, _ in connected_users.iteritems():
    sendUpdatedListOfClientsTo(regid)

def remindMeAgainEh(msg, payload):
  sendUpdatedListOfClientsTo(msg["from"])

def sendEh(msg, payload):
  send_queue.append({
    'to': payload['to_userid'],
    'message_id': random_id(),
    'data': {
      'type': 'incomingEh',
      'from_userid': msg['from']
    }
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
    return;

  handler = handlers[payload['type']]
  try:
    handler(msg, payload)
  except Exception as e:
    print "Handler of type " + payload['type'] + " had a meltdown:"
    print e

################################################################################

def readUsernameAndPasswordFromFile(path):
  import json
  json_data = open(path)
  ret = json.load(json_data)
  json_data.close()
  return ret

################################################################################

def main():
  global client
  client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
  client.connect(server=(SERVER, PORT), secure=1, use_srv=False)

  # TODO: support command line args for auth info / path to file
  authData = readUsernameAndPasswordFromFile('../gcm_auth_info.json')
  auth = client.auth(authData['username'], authData['password'])

  if not auth:
    print 'Authentication failed!'
    sys.exit(1)

  client.RegisterHandler('message', message_callback)

  while True:
    client.Process(1)
    flush_queued_messages()

################################################################################

if __name__ == '__main__':
  main()
