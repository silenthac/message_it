function sendPost(e){
    const searchResults = document.getElementById('searchposts');
    let match = e.value.match(/^[a-zA-Z]*/);
    let match2 = e.value.match(/\s*/);

    if(match2[0]===e.value){
      searchResults.innerHTML = '';
      return;
    }
    if(match[0]===e.value){
    fetch('searchPosts',{
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({payload: e.value})
    }).then(res => res.json()).then(data =>{
      let payload = data.payload;
   
      searchResults.innerHTML = '';

      if(payload.length <1 ){
        searchResults.innerHTML = '<p>Sorry Nothing Found </p>';
        return;
      }
      payload.forEach((item, index) =>{

        if(index > 0 ) searchResults.innerHTML += '<hr>';
        searchResults.innerHTML += `<a href='posts/${item._id}'>${item.title}</a>`;
      });
      
  
    });
  }
  }