'use strict';


$('#list').click(function () {
  $('#resultsEventsList').show();
  $('#resultssSongsList').show();
});
$('#songslist').click(function () {
  $('#resultsEventsList').hide();
  $('#resultssSongsList').show();
});
$('#eventslist').click(function () {
  $('#resultssSongsList').hide();
  $('#resultsEventsList').show();
});




$('#login').submit(function (e) {

  e.preventDefault();
  if ($('#emailL').val() === '' || $('#passwordL').val() === '') {
    alert('Please fill field!');
    return;
  }

  $.post('/login', { email: $('#emailL').val().toLowerCase(), password: $('#passwordL').val() }, function (data) {

    if (data === `Password or Unsername not correct!`)
      alert(data);
    else {
      window.localStorage.setItem('user', data);
      console.log(' file: app.js ~ line 36 ~ data', data);
      window.location.href = `/myprofile/${JSON.parse(data).username}`;
    }

  });
});




$('.logout').submit(function (e) {
  e.preventDefault();
  window.localStorage.removeItem('user');
  window.location.href = '/';
});


$('#signup').submit(function (e) {
  e.preventDefault();
  if ($('#email').val() === '' || $('#pass1').val() === '' || $('#name').val() === '') {
    alert('Please fill field!');
    return;
  }

  if ($('#pass1').val() !== $('#pass2').val()) {
    alert('Your password not match!');
    return;
  }
  $.post('/singUp', { name: $('#name').val(), email: $('#email').val().toLowerCase(), password: $('#pass1').val() }, function (data) {

    if (data === `This user is aleady signed up!`)
      alert(data);
    else {
      window.localStorage.setItem('user', data);
      window.location.href = `/myprofile/${JSON.parse(data).username}`;

    }

  });
});



$('body #addSong').submit(function (e) {
  e.preventDefault();
  console.log(e.target.user.value);
  $.post(`/addsong/${e.target.user.value}`, {
    title: e.target.title.value, preview: e.target.preview.value,
    image: e.target.image.value, name: e.target.name.value
  }, function (data) {
    $(`#song${e.target.id.value}`).html(data);
  });
});

$('body #addSongByArtist').submit(function (e) {
  e.preventDefault();
  console.log(e.target.user.value);
  $.post(`/addsong/${e.target.user.value}`, {
    title: e.target.title.value, preview: e.target.preview.value,
    image: e.target.image.value, name: e.target.name.value
  }, function (data) {
    $(`#artist${e.target.id.value}`).html(data);
  });
});


$('body #deleteSong').submit(function (e) {
  e.preventDefault();

  $.post(`/addsong/${$('#user').val()}`, {

    title: e.target.title.value, preview: e.target.preview.value,
    image: e.target.image.value, name: e.target.name.value
  }, function (data) {
    $('#myButton1').html(data);

    window.location.href = `/myprofile/${$('#user').val()}`;
  });
});





$('body #addEvents').submit(function (e) {
  e.preventDefault();

  $.post(`/addevent/${$('#user').val()}`, {

    image: e.target.image.value, name: e.target.name.value,
    title: e.target.title.value, time: e.target.time.value,
    location: e.target.location.value,
    offer: e.target.offer.value,
    description: e.target.description.value,
    venue: e.target.venue.value
  }, function (data) {
    $(`#addeventbutton${e.target.index.value}`).html(data);
  });
});


$('body #deleteEvent').submit(function (e) {
  e.preventDefault();

  $.post(`/addevent/${$('#user').val()}`, {

    image: e.target.image.value, name: e.target.name.value,
    title: e.target.title.value, time: e.target.time.value,
    location: e.target.location.value,
    offer: e.target.offer.value,
    description: e.target.description.value,
    venue: e.target.venue.value
  }, function (data) {
    $('#addeventbutton').html(data);

    window.location.href = `/myprofile/${$('#user').val()}`;
  });
});


$('#updateForm').hide();
$('#updateBtn').on('click', function () {
  $('#updateForm').toggle();
});



$('#loginBtn').show();
$('#signupBtn').show();
$('#updateSingUp').hide();
$('#updateLogin').hide();

$('#signupBtn').on('click',function(){
  $('#loginBtn').toggle();
  $('#updateSingUp').toggle();
  $('#signupBtn').hide();
});

$('#loginBtn').on('click',function(){
  $('#signupBtn').toggle();
  $('#updateLogin').toggle();
  $('#loginBtn').hide();
});


$('#Alreadyhaveaccount').on('click',function(){
  $('#signupBtn').hide();
  $('#updateSingUp').toggle();
  $('#updateLogin').toggle();
  $('#loginBtn').hide();
});

$('#Nothaveaccount').on('click',function(){
  $('#loginBtn').hide();
  $('#updateSingUp').toggle();
  $('#updateLogin').toggle();
  $('#signupBtn').hide();
});


$('.close').on('click',function(){
  $('#loginBtn').show();
  $('#updateSingUp').hide();
  $('#updateLogin').hide();
  $('#signupBtn').show();
});



$('#eventForm').hide();
$('#TrackBtn').click(function () {
  $('#eventForm').hide();
  $('#songForm').show();
});
$('#eventBtn').click(function () {
  $('#eventForm').show();
  $('#songForm').hide();
});

$('#list').click(function () {
  $('#list').css('background', '#FF614A');
  $('#eventslist').css('background', 'var(--button)');
  $('#songslist').css('background', 'var(--button)');
});
$('#eventslist').click(function () {
  $('#eventslist').css('background', '#FF614A');
  $('#list').css('background', 'var(--button)');
  $('#songslist').css('background', 'var(--button)');
});
$('#songslist').click(function () {
  $('#songslist').css('background', '#FF614A');
  $('#eventslist').css('background', 'var(--button)');
  $('#list').css('background', 'var(--button)');
});
