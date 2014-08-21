#!/usr/bin/python
import sys, json, random, string
import xmpp

################################################################################

SERVER = 'gcm.googleapis.com'
PORT = 5235
USERNAME = '90031296475'
PASSWORD = 'AIzaSyBa5T4FvOUgxKLHyzTf13FLw9UU02GR3Lc'

unacked_messages_quota = 1000
send_queue = []
client = None

connected_users = {}

################################################################################

# Return a random alphanumerical id
def random_id():
  rid = ''
  for x in range(8): rid += random.choice(string.ascii_letters + string.digits)
  return rid

################################################################################

def add_user(regid, name):
  connected_users[regid] = name

################################################################################

def sendUpdatedListOfClientsToClients():
  for (regid,name) in connected_users.iteritems():
    send_queue.append({
      'to': regid,
      'message_id': random_id(),
      'data': {
        'type': 'userListChangeEh',
        'users': connected_users.items()
      }
    })

################################################################################

def sendEh(from_userid, to_userid):
  send_queue.append({
    'to': to_userid,
    'message_id': random_id(),
    'data': {
      'type': 'sendEh',
      'from_userid': from_userid
    }
  })

################################################################################

def send(json_dict):
  template = "<message><gcm xmlns='google:mobile:data'>{1}</gcm></message>"
  content = template.format(client.Bind.bound[0], json.dumps(json_dict))
  client.send(xmpp.protocol.Message(node = content))
  #print "Sent: " + json.dumps(json_dict, indent=2)

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

  #print "Got: " + json.dumps(msg, indent=2)
  if msg.has_key('message_type') and (msg['message_type'] == 'ack' or msg['message_type'] == 'nack'):
    unacked_messages_quota += 1
    return

  # Acknowledge the incoming message immediately.
  send({
    'to': msg['from'],
    'message_type': 'ack',
    'message_id': msg['message_id']
  })

  if not msg.has_key('data') or not msg['data'].has_key('payload'):
    print "WARNING: No Payload!"
    return

  payload = json.loads(msg['data']['payload'])
  msg_type = payload['data']['type']

  if msg_type == 'identifySelfEh':
    # Add this user to the list of actives
    # TODO: how to prune users? (Perhaps after they fail to ack a message?)
    add_user(msg['from'], payload['data']['name'])
    sendUpdatedListOfClientsToClients()
  elif msg_type == 'sendEh':
    sendEh(msg['from'], payload['data']['to_userid'])

  # Send a dummy echo response back to the app that sent the upstream message.
  #send_queue.append({
  #  'to': msg['from'],
  #  'message_id': random_id(),
  #  'data': {
  #     'pong': msg['message_id']
  #  }
  #})

################################################################################

def main():
  global client
  client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
  client.connect(server=(SERVER,PORT), secure=1, use_srv=False)
  auth = client.auth(USERNAME, PASSWORD)

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
