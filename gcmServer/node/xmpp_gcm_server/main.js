var xmpp = require('node-xmpp-client');

var options = {
  type: 'client',
  jid: '90031296475@gcm.googleapis.com',
  password: 'AIzaSyBa5T4FvOUgxKLHyzTf13FLw9UU02GR3Lc',
  port: 5235,
  host: 'gcm.googleapis.com',
  legacySSL: true,
  preferredSaslMechanism : 'PLAIN'
};

console.log('about to connect');

var cl = new xmpp.Client(options);
cl.on('online', function()
{
    console.log("XMPP Online");
});
