document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);


let $login = document.getElementById('loginbutton')
$login.onclick = ((event) => {
  console.log("ola")
  event.preventDefault();

  return axios.post('/login').then((res) => {
    console.log(res);
  });

})