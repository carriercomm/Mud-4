define [
  "controller/gameConnection"
], (GameConnection) ->
  class FacebookApi
    constructor: (cb) ->
      window.fbAsyncInit = =>
        FB.init 
          appId: '352563524862947'
          channelUrl: '//localhost/Mud/channel.html'
          status: true
          cookie: true
          xfbml: true
          oauth: true

        cb @

      id = "facebook-jssdk"
      ref = document.getElementsByTagName("script")[0]
      return if document.getElementById(id)
      js = document.createElement("script")
      js.id = id
      js.async = true
      js.src = "//connect.facebook.net/en_US/all.js"
      ref.parentNode.insertBefore(js, ref)

    getLoginStatus: (cb) ->
      FB.getLoginStatus (response) =>
        cb response

    login: (cb) ->
      FB.login (response) =>
        FB.api '/me', (userData) =>
          cb userData
      , scope: 'email'

    getUserData: (cb) ->
      FB.api '/me', (userData) =>
        cb userData
      , scope: 'email'
        
            
