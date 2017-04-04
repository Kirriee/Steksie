// When the DOM is ready, run this function
$(document).ready(function() {

  //SET THE CAROUSEL OPTIONS
  $('#quote-carousel').carousel({
  	pause: true,
  	interval: 4000,
  });
});

//FILTER FUNCTION ON OFFERS PAGE

$('.category_item').click(function(){
	var category = $(this).attr('id');
	if(category == 'all'){                   // ALL CITIES
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

// SIGN UP FORM TWO PAGES

function show_next(id,nextid)
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
   
  }
  else
  {
    console.log("Did not fill out all fields")
  }
}

function show_prev(previd)
{
  document.getElementById("account-details").style.display="none";
  document.getElementById("adress-details").style.display="none";
  
  $("#"+previd).fadeIn();
 
}

