window.addEventListener('polymer-ready', function(e) {
  var contacts = [
    { name: "Loonie" },
    { name: "Toonie" }
  ];
  document.getElementById('contacts').contacts = contacts;
});
