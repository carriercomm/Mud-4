class MessagesEnglish

  def initialize
    @messages = {
      :new_character =>
        '<br/>You must create a new character, since you don\'t have any<br/>
        Available classes are:<br/><br/>

        <font color="cyan">Mage</font>
        <font color="red">Barbarian</font>
        <font color="green">Ranger</font><br/> Pick one'
    }
  end

  def get (message)
    @messages[message.to_sym]
  end
end