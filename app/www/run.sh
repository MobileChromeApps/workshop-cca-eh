cd ~/dev/workspace/Eh/www

vulcanize --csp --strip -o foreground/vulcanized.html foreground/index.html
cca run chrome
