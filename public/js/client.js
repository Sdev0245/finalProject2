const deleteButton = (btn)=>{
    const prodId = btn.parentNode.querySelector('[name = productId]').value;
    const csrf = btn.parentNode.querySelector('[name = _csrf]').value;
    const parentElement = btn.closest('article');
    fetch('/admin/product/'+prodId,{
        method:'DELETE',
        headers:{
        'csrf-token':csrf}
    }).then(val=>{
       return val.json();
    }).then(val=>{

        parentElement.parentNode.removeChild(parentElement);
    }).catch(err=>{
        console.log(err);
    })


};
