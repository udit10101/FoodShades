if (navigator.geolocation) { //check if geolocation is available
    navigator.geolocation.getCurrentPosition(async function (position) {
      console.log("hey");
      console.log(position);
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const city = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`).then(res => res.json()).then(res => {
        console.log(res.city);
        const cty = res.city;
        return cty;
      })
      document.getElementsByClassName('address')[0].innerText = city;
    });
  }
  else {
    console.log("geo not found");
  }