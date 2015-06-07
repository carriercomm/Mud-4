var client, events

$('html').click(function () {
  return $('#prompt_input').focus()
})

client = new MudClient()
events = new Events(client)
