#!/usr/bin/python
import sys, json, random, string
import xmpp

################################################################################

SERVER = 'gcm.googleapis.com'
PORT = 5235
USERNAME = '90031296475'
PASSWORD = 'AIzaSyBa5T4FvOUgxKLHyzTf13FLw9UU02GR3Lc'
REGISTRATION_ID = 'APA91bHoyikUYrbEZ0qY98IS0dNuvqh6A1fpWGBBr1g1ruejYCP8YmSOcGM6u9haxUlVYlbD0OTKTRy1YxzjfQM8wcCDvjiTFmbGddT5l_d4loFIhq1AA51PFN3pUI8YMf-TtW5nv2UIaEnpl0HupyVjdFuKdg_RfA'

unacked_messages_quota = 1000
send_queue = []
client = None

connected_users = set()

################################################################################

# Return a random alphanumerical id
def random_id():
  rid = ''
  for x in range(8): rid += random.choice(string.ascii_letters + string.digits)
  return rid

################################################################################

def message_callback(session, message):
  global unacked_messages_quota
  gcm = message.getTags('gcm')
  if not gcm:
    return
  gcm_json = gcm[0].getData()
  msg = json.loads(gcm_json)

  print "Got: " + json.dumps(msg, indent=2)
  if msg.has_key('payload'):
    print "  Payload: " + json.dumps(json.loads(msg['payload']), indent=2)

  if msg.has_key('message_type') and (msg['message_type'] == 'ack' or msg['message_type'] == 'nack'):
    unacked_messages_quota += 1
    return

  # Acknowledge the incoming message immediately.
  send({
    'to': msg['from'],
    'message_type': 'ack',
    'message_id': msg['message_id']
  })

  # Add this user to the list of actives
  # TODO: how to prune users? (Perhaps after they fail to ack a message?)
  connected_users.add(msg['from'])
  sendUpdatedListOfClientsToClients()

  # Send a dummy echo response back to the app that sent the upstream message.
  #send_queue.append({
  #  'to': msg['from'],
  #  'message_id': random_id(),
  #  'data': {
  #     'pong': msg['message_id']
  #  }
  #})

################################################################################

def sendUpdatedListOfClientsToClients():
  userIds = list(connected_users);
  for user in userIds:
    send_queue.append({
      'to': user,
      'message_id': random_id(),
      'data': {
         'users': userIds
      }
    })

################################################################################

def send(json_dict):
  template = "<message><gcm xmlns='google:mobile:data'>{1}</gcm></message>"
  content = template.format(client.Bind.bound[0], json.dumps(json_dict))
  client.send(xmpp.protocol.Message(node = content))
  print "Sent: " + json.dumps(json_dict, indent=2)

################################################################################

def flush_queued_messages():
  global unacked_messages_quota
  while len(send_queue) and unacked_messages_quota > 0:
    send(send_queue.pop(0))
    unacked_messages_quota -= 1

################################################################################

def main():
  global client
  client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
  client.connect(server=(SERVER,PORT), secure=1, use_srv=False)
  auth = client.auth(USERNAME, PASSWORD)

  if not auth:
    print 'Authentication failed!'
    sys.exit(1)

  #send({
  #  'to': REGISTRATION_ID,
  #  'message_id': 'reg_id',
  #  'data': {
  #    'message_destination': 'RegId',
  #    'message_id': random_id()
  #  }
  #})

  client.RegisterHandler('message', message_callback)

  while True:
    client.Process(1)
    flush_queued_messages()

################################################################################

if __name__ == '__main__':
  main()
