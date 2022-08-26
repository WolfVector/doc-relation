async function handleAsyncReq(obj_req) {  
  let res = await fetch(obj_req.url, obj_req.body);
  return ((res.ok == false) ? false : await res.json());
}

export { handleAsyncReq }