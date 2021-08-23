// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your Javascript code.

function createJSON(y) {
    var a = {};
    for (var x in y) {
        a[x] = {};
        var mon = {};
        //console.log(x);
        a[x].id = x;
        a[x].num = y[x].num;
        a[x].name = y[x].name;
        a[x].ability1 = y[x].abilities[0];
        a[x].ability2 = y[x].abilities[1];
        a[x].abilityH = y[x].abilities["H"];
        a[x].hp = y[x].baseStats.hp;
        a[x].atk = y[x].baseStats.atk;
        a[x].def = y[x].baseStats.def;
        a[x].spa = y[x].baseStats.spa;
        a[x].spd = y[x].baseStats.spd;
        a[x].spe = y[x].baseStats.spe;
        a[x].weight = y[x].weightkg;
        a[x].type1 = y[x].types[0];
        a[x].type2 = y[x].types[1];
        //console.log(mon);
        //a[y[x].id] = mon;
    }
    //console.log(a);
    var b = JSON.stringify(a);
    console.log(b);

    
}