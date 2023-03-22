//AXIOS GLOBALS
axios.defaults.headers.common['X-Auth-Token']='sometoken';

// GET REQUEST
function getTodos() {
  //console.log('GET Request');
  // axios({
  //   method: 'get',
  //   url:'https://jsonplaceholder.typicode.com/todos',
  //   params:{
  //     _limit:5 //limit to first 5 data
  //   }
  // })//.then(res=>console.log(res)) //if we want to show on console
  // //.then(res=>console.log(res.data)) if need to access just data on console
  // .catch(err=>console.log(err))
  // .then(res=>showOutput(res)) //if we want to show data inside browser

  // axios.get('https://jsonplaceholder.typicode.com/todos', {
  //   params: {_limit:5}
  axios('https://jsonplaceholder.typicode.com/todos', {  //by default axios is get request
    params: {_limit:5}
  },{timeout:5000})//loading time after which it will give roor that it tried but not got in that time
  .catch(err=>console.log(err))
  .then(res=>showOutput(res)) //if we want to show data inside browser
}

// POST REQUEST
function addTodo() {
  //console.log('POST Request');
  axios.post('https://jsonplaceholder.typicode.com/todos',{
    data:{
      title:'New Todo',
      completed:false
    }
  }).catch(err=>console.log(err))
  .then(res=>showOutput(res))
}

// PUT/PATCH REQUEST //Put is used to replace entire resource patch used to updat in increment
function updateTodo() {
  //console.log('PUT/PATCH Request');
  // axios.put('https://jsonplaceholder.typicode.com/todos/1',{ //update the url with id of the todo we want to put/update/replace whole thing as shown on site
  //   
  //     title:'Updated Todo',
  //     completed:false
  //   
  axios.patch('https://jsonplaceholder.typicode.com/todos/1',{ //update the url with id of the todo we want to update only the things and not userid,title in increment
    
      title:'Updated Todo',
      completed:false
    
  }).catch(err=>console.log(err))
  .then(res=>showOutput(res))
}

// DELETE REQUEST
function removeTodo() {
  // console.log('DELETE Request');
  axios.delete('https://jsonplaceholder.typicode.com/todos/1') //deleted the data at the location and will give empty object
  .catch(err=>console.log(err))
.then(res=>showOutput(res))
}

// SIMULTANEOUS DATA
function getData() {
  // console.log('Simultaneous Request');
  axios.all([axios.get('https://jsonplaceholder.typicode.com/todos/?_limit=5'),
  axios.get('https://jsonplaceholder.typicode.com/posts/?_limit=5')
]).catch(err=>console.log(err))
// .then(res=>showOutput(res[1]))//only get 1 request
.then(axios.spread((todos,posts)=>showOutput(posts)))
}

// CUSTOM HEADERS
function customHeaders() {
  // console.log('Custom Headers');
  const config = {
    headers:{
      'Content-Type':'application/json',
      Authorization: 'sometoken'
    }
  }
  axios.post('https://jsonplaceholder.typicode.com/todos',{
      title:'New Todo',
      completed:false
    },config
  ).catch(err=>console.log(err))
  .then(res=>showOutput(res))

}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  // console.log('Transform Response');
  const options={
    method:post,
    url:'https://jsonplaceholder.typicode.com/todos'
    ,data:{
      title:'New Todo',
    }, transformResponse:axios.defaults.transformResponse.concat(data=>{
      data.title=data.title.toUpperCase();
      return data;
    })
  }
  axios(options).then(res=>showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  // console.log('Error Handling');
  axios('https://jsonplaceholder.typicode.com/todoss', {
    // validateStatus: function(status){
    //   return status<500; //Reject only if status greater than equal to 500
    // }
  }) //wrong url
  .then(res=>showOutput(res))
  .catch(err=>{
    if(err.response){
      console.log(err.response.data)
      console.log(err.response.status)
      console.log(err.response.headers)

      if (err.response.status===404){
        alert('Error:Page not found')
      }
      else if(err.request){ //Request made but no response
        console.error(err.request)
      }
      else{
        console.error(err.message)
      }
    }
  })
  
}

// CANCEL TOKEN
function cancelToken() {
  // console.log('Cancel Token');
  const source=axios.CancelToken.source();
  axios.get('https://jsonplaceholder.typicode.com/todos', {
    cancelToken:source.token
  })
  .then(res=>showOutput(res))
  .catch(thrown=>{
    if (axios.isCancel(thrown)){
      console.log('Request canceled',thrown.message)
    }
  })
  if(true){
    source.cancel('Requestcanceled')
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config=>{
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`)
return config
}, error=>{
  return Promise.reject(error)
}
)

// AXIOS INSTANCES
const axiosInstance=axios.create({
  //Other custom settings
  baseURL:'https://jsonplaceholder.typicode.com/'
});
// axiosInstance.get('/comments').then(res=>showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
