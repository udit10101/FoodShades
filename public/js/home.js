function searchFnc() {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchbar');
    filter = input.value.toUpperCase();
   
    restCont = document.getElementsByClassName('res_container')[0]
    res = document.getElementsByClassName('res-card')
    resnames = restCont.getElementsByClassName('res-name')

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < res.length; i++) {
        let match = res[i].getElementsByClassName('res-name')[0]
        let txtValue = match.textContent || match.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            res[i].style.display = " "
        } else {
            res[i].style.display = "none "
        }
        if (!filter) {
            
            for (i = 0; i < res.length; i++) {
                res[i].style.display = "block"
            }

        }
    }
}