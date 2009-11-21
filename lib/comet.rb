require 'sinatra/base'
require 'eventmachine'
require 'singleton'
require 'json'
require 'uuid'

module Sinatra
  module Helpers
    AsyncResponse = [-1, {}, []]

    def subscribe(id = false)
      client = Comet::Server.add_client(id)
      client.call({"id" => client.id}.to_json)
      EM.next_tick do
        renderer = request.env['async.callback']
        renderer.call [200, {'Content-Type' => 'text'}, client]
      end
      AsyncResponse
    end

    def publish(sender_id, message)
      Comet::Server.clients.each do |client|
        EM.next_tick { client.call(message) } unless client.id == sender_id
      end
      message
    end

    def unsubscribe(id)
      Comet::Server.remove_client(id)
    end
  end
end

module Comet
  class Server
    include Singleton
    attr_accessor :clients

    def initialize
      @clients = []
    end

    def self.clients
      self.instance.clients
    end

    def self.add_client(id = false)
      client = Comet::Client.new(id)
      client.errback  { self.remove_client(client.id) }
      client.callback { self.remove_client(client.id) }
      self.clients << client

      log("+ Client #{client.id} subscribed.")
      client
    end

    def self.remove_client(id)
      log("- Unsubscribed client #{id}")
      self.clients.delete_if {|client| client.id == id}
    end

    private

    def self.log(str)
      print str, "\n"
    end
  end

  class Client
    include EventMachine::Deferrable
    attr_accessor :id

    def initialize(id = false)
      @id = id || UUID.generate
      @queue = []
    end

    def schedule_dequeue
      return unless @body_callback
      EM.next_tick do
        next unless body = @queue.shift
        body.each do |chunk|
          @body_callback.call(chunk)
        end
        schedule_dequeue unless @queue.empty?
      end
    end

    def call(body)
      @queue << body
      schedule_dequeue
    end

    def each(&blk)
      @body_callback = blk
      schedule_dequeue
    end
  end
end
