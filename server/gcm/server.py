#!/usr/bin/python
import sys, json, random, string
import xmpp

SERVER = 'gcm.googleapis.com'
PORT = 5235
USERNAME = '90031296475'
PASSWORD = 'AIzaSyBa5T4FvOUgxKLHyzTf13FLw9UU02GR3Lc'
REGISTRATION_ID = 'APA91bHoyikUYrbEZ0qY98IS0dNuvqh6A1fpWGBBr1g1ruejYCP8YmSOcGM6u9haxUlVYlbD0OTKTRy1YxzjfQM8wcCDvjiTFmbGddT5l_d4loFIhq1AA51PFN3pUI8YMf-TtW5nv2UIaEnpl0HupyVjdFuKdg_RfA'
#REGISTRATION_ID = 'APA91bG7SV92n688m_DgQugXhDmN8aamDn_-eHHFAmbNtA4BsGK1EHyym-dJWEH9EXCK2Q-ZKoE_Q-bbMp0R5hNa82EkFmQXoHVoBSHck2YpKy5gQvt0dyPV3agRw2sUV_DraxruqYsJWOWoRF3g9Hgf03-4Z8EEWw'

unacked_messages_quota = 1000
send_queue = []

# Return a random alphanumerical id
def random_id():
  rid = ''
  for x in range(8): rid += random.choice(string.ascii_letters + string.digits)
  return rid

def message_callback(session, message):
  global unacked_messages_quota
  gcm = message.getTags('gcm')
  if gcm:
    gcm_json = gcm[0].getData()
    msg = json.loads(gcm_json)
    if not msg.has_key('message_type'):
      # Acknowledge the incoming message immediately.
      send({'to': msg['from'],
           'message_type': 'ack',
           'message_id': msg['message_id']})
      # Queue a response back to the server.
      if msg.has_key('from'):
        # Send a dummy echo response back to the app that sent the upstream message.
        send_queue.append({'to': msg['from'],
                               'message_id': random_id(),
                               'data': {'pong': msg['message_id']}})
      print 'device: '+ msg['from']
    elif msg['message_type'] == 'ack' or msg['message_type'] == 'nack':
      unacked_messages_quota += 1

def send(json_dict):
  template = ("<message><gcm xmlns='google:mobile:data'>{1}</gcm></message>")
  client.send(xmpp.protocol.Message(
                                    node=template.format(client.Bind.bound[0], json.dumps(json_dict))))

def flush_queued_messages():
  global unacked_messages_quota
  while len(send_queue) and unacked_messages_quota > 0:
    send(send_queue.pop(0))
    unacked_messages_quota -= 1

client = xmpp.Client('gcm.googleapis.com', debug=['socket'])
client.connect(server=(SERVER,PORT), secure=1, use_srv=False)
auth = client.auth(USERNAME, PASSWORD)
if not auth:
  print 'Authentication failed!'
  sys.exit(1)

client.RegisterHandler('message', message_callback)

send_queue.append({'to': REGISTRATION_ID,
                  'message_id': 'reg_id',
                  'data': {'message_destination': 'RegId',
                  'message_id': random_id()}})

while True:
  client.Process(1)
  flush_queued_messages()
