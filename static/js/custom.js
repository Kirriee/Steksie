// When the DOM is ready, run this function
$(document).ready(function() {
  //Set the carousel options
  $('#quote-carousel').carousel({
  	pause: true,
  	interval: 4000,
  });
});


$('.category_item').click(function(){
	var category = $(this).attr('id');
	if(category == 'all'){
		$('.plant_item').addClass('hide');
		setTimeout(function(){
			$('.plant_item').removeClass('hide');
		}, 300);
	} 
	else {
		$('.plant_item').addClass('hide');
		setTimeout(function(){
			$('.' + category).removeClass('hide');
		}, 300);
	}
});


function show_next(id,nextid,bar)
{
  var ele=document.getElementById(id).getElementsByTagName("input");
  var error=0;
  for(var i=0;i<ele.length;i++)
  {
    if(ele[i].type=="text" && ele[i].value=="")
  {
    error++;
  }
  }
	
  if(error==0)
  {
    document.getElementById("account-details").style.display="none";
    document.getElementById("adress-details").style.display="none";
    
    $("#"+nextid).fadeIn();
    document.getElementById(bar).style.backgroundColor="#38610B";
  }
  else
  {
    console.log("Did not fill out all fields")
  }
}

function show_prev(previd,bar)
{
  document.getElementById("account-details").style.display="none";
  document.getElementById("adress-details").style.display="none";
  
  $("#"+previd).fadeIn();
  document.getElementById(bar).style.backgroundColor="#D8D8D8";
}

