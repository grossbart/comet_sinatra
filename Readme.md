Comet Sinatra
=======================================

This is a small push-server example for Sinatra. I did this mostly for me in order to understand, how such a server can be implemented. There are certainly more robust ways to achieve this. Ask Google.


Installation
------------

You need to have the Thin, Sinatra and JSON gems installed:

    sudo gem install thin
    sudo gem install sinatra
    sudo gem install json

After this, you can start the web server like this:

    ruby app.rb


Explanation
-----------

When a Javascript client connects to the webserver, the server keeps the connection open by pretending that the data hasn't fully loaded yet. As soon as another Javascript client sends the server a message, the server will append this to the sent data. It's kind of like sending an image line for line.

Because the messages are not separate from each other, but sent as one big document, a pointer has to be maintained in order to know which data has already been interpreted and which is new.


Contributors
------------

* Carlo Jörges, started it all.
* Peter Gassner <peter@naehrstoff.ch>, cleaned up the code and put it into a neat package.
