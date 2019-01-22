let socket = io();

function scrollToBottom () {
  //Selectors
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child');
  //Heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  };
};

socket.on('connect', function () {
  let params = $.deparam(window.location.search);
  console.log(`${params.name} has joined the ${params.room} Room.`);
  let room =  params.room;
  $('#room').html(room);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No Error');
    }
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  console.log('Users List', users);
  let ol = $('<ol></ol>');

  users.forEach(function (user) {
    ol.append($('<li></li>').text(user));
  });

  $('#users').html(ol);
});

socket.on('newMessage', function (message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message) {

  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#location-message-template').html();
  let html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  $('#messages').append(html);
  scrollToBottom();
});


$('#message-form').on('submit', function(e) {
  e.preventDefault();

  let messsageTextBox = $('[name=message]');

  socket.emit('createMessage', {
    text: messsageTextBox.val()
  }, function () {
    text: messsageTextBox.val('')
  });
});

let geo = navigator.geolocation;

let locationButton = $('#send-location');
locationButton.on('click', function () {
  if (!geo) {
    return alert('Geolocation not supported by this browser.')
  }
  locationButton.attr('disabled', 'disabled').text('Sharing Location...');

  geo.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Share Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

  }, function () {
    locationButton.removeAttr('disabled').text('Share Location');
    alert('Unable to fetch location');
  });
});
