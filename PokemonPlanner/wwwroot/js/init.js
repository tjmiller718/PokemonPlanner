var learnsets;
var pokemon;
var moves;
var counter = 0;
var selectedTrigger = false;

var selectedPokemon;

var currentTeam = [];

var pokemonList = [];
$(document).ready(function () {
    $.when(getLearnsets(), getPokemon(), getMoves()).done(function (d1, d2, d3) {
        for (var p in pokemon) {
            pokemonList.push({ text: pokemon[p].name, id: pokemon[p].id });
        }
        $('#pokemonListDropdown').select2({ data: pokemonList, width: 'resolve' });

        if (currentTeam.length == 0)
            $('#littleD').show();
        else
            $('#littleD').hide();

        $('#abilityFactor').change(function () {
            populateContainer4();
        })

        $('#addPokemon').on('click', function () {
            $('#littleD').hide();
            $('#container3').show();
            $('#container4').show();
            $('#abilityCheckboxDiv').show();
            if (currentTeam.length > 19) {
                alert("Too many pokemon selected!");
            } else {
                var currentMon;
                for (var a in pokemon) {
                    if (pokemon[a].id == $('#pokemonListDropdown').val())
                        currentMon = pokemon[a];
                }
                currentMon = analyzeType(currentMon);
                currentMon = getSpriteURL(currentMon);

                //console.log(currentMon);

                $('#currentTeamRow').append(
                    '<div class="pokemon-box-wrapper" data-pokemonid="' + currentMon.id + '">' + currentMon.name +
                    '<div class="pokemon-box" data-pokemonid="' + currentMon.id + '">' +
                    '<span class="image-helper"></span>' +
                    '<img class="medium-image" src="' + currentMon.spriteURL + '"></img>' +
                    '</div>' +
                    '<span class="pokemonTrashCan"><i class="fa fa-trash clickable"></i></span>' +
                    '</div>');

                currentTeam.push(currentMon);

                $('.pokemonTrashCan').off('click').on('click', function () {
                    var pokeID = $(this).closest('.pokemon-box-wrapper').data('pokemonid');
                    console.log(pokeID);
                    for (var c in currentTeam) {
                        console.log(currentTeam[c].id);
                        if (currentTeam[c].id == pokeID) {
                            currentTeam.splice(c, 1);
                            break;
                        }
                    }
                    $(this).closest('.pokemon-box-wrapper').remove();

                    populateContainer3();

                    if (currentTeam.length == 0) {
                        $('#littleD').show();
                        $('#container3').hide();
                        $('#container4').hide();
                        $('#abilityCheckboxDiv').hide();
                    }
                });

                counter++;

                $('.pokemon-box').off('click').on('click', function () {
                    selectedPokemon = pokemon[$(this).data('pokemonid')];
                    $('#pokemonListDropdown').val(selectedPokemon.id).trigger('change');
                    $(this).addClass('pokemon-selected');
                });


                populateContainer3();
                populateContainer4();
            }
        });

        $('#pokemonListDropdown').on('change', function () {
            $('.pokemon-box').removeClass('pokemon-selected');
            for (var a in pokemon) {
                if (pokemon[a].id == $('#pokemonListDropdown').val()) {
                    selectedPokemon = pokemon[a];
                    break;
                }
            }
            updateSelectedPokemon();
        });

        $('#pokemonListDropdown').val('abomasnow').trigger('change');

        $('#selectedPokemonInformation').on('click', function () {
            $('#myModal').modal();
        });
    });
});

function updateSelectedPokemon() {
    //var selectedBST = selectedPokemon.HP + selectedPokemon.Atk + selectedPokemon.Def + selectedPokemon.SpA + selectedPokemon.SpD + selectedPokemon.Spe;
    //var data = [[selectedPokemon.HP, selectedPokemon.Atk, selectedPokemon.Def, selectedPokemon.SpA, selectedPokemon.SpD, selectedPokemon.Spe, selectedBST]];
    
    $('#selectedHP').html(selectedPokemon.hp);
    $('#selectedAtk').html(selectedPokemon.atk);
    $('#selectedDef').html(selectedPokemon.def);
    $('#selectedSpA').html(selectedPokemon.spa);
    $('#selectedSpD').html(selectedPokemon.spd);
    $('#selectedSpe').html(selectedPokemon.spe);
    $('#selectedBST').html(selectedPokemon.hp + selectedPokemon.atk + selectedPokemon.def + selectedPokemon.spa + selectedPokemon.spd + selectedPokemon.spe);

    $('#selectedAbility1').html(selectedPokemon.ability1 || '-');
    $('#selectedAbility2').html(selectedPokemon.ability2 || '-');
    $('#selectedAbilityH').html(selectedPokemon.abilityH || '-');

    $('#selectedType1').html('<img src="/images/' + selectedPokemon.type1.toLowerCase() + '.png"></img>');
    if (selectedPokemon.type2)
        $('#selectedType2').html('<img src="/images/' + selectedPokemon.type2.toLowerCase() + '.png"></img>');
    else
        $('#selectedType2').html('');

    selectedPokemon = getSpriteURL(selectedPokemon);
    console.log(selectedPokemon);
    $('#selectedPokemonSprite').html('<img class="medium-large-image" src="' + selectedPokemon.spriteURL + '"></img>')

    //$('#selectedPokemonName').html(selectedPokemon.name);
}

function populateSpeedTiersTable() {
    if (currentTeam.length > 0) {
        var sortedTeam = currentTeam;
        sortedTeam.sort((a, b) => (a.spe < b.spe) ? 1 : -1);
        console.log(sortedTeam);
        $('#teamSpeedTiersTable').html('');
        for (var p in sortedTeam) {
            $('#teamSpeedTiersTable').append('<tr>' + 
                /*'<td>' + sortedTeam[p].name + '</td>' +*/
                '<td><img class="tiny-image" src="' + sortedTeam[p].spriteURL + '"></img></td>' +
                '<td>' + sortedTeam[p].spe + '</td>' +
                '</tr>')
        }
    }
    else
        return;
}

function populateContainer3() {

}

function populateContainer4() {
    populateSpeedTiersTable();

    $('#teamTypingsTable td[data-type]').html('');
    $('#offensiveCoverageTable td[data-type]').html('');
    $('#weaknessesTable td[data-strength]').html('');
    $('#weaknessesTable .typeDifference').html('');

    for (var p in currentTeam) {
        $('#teamTypingsTable td[data-type="' + currentTeam[p].type1.toLowerCase() + '"]').append('<img class="baby-image" src="' + currentTeam[p].spriteURL + '"></img>');
        // add '<img class="tiny-image" src="' + currentTeam[p].spriteURL + '"></img>' to the row associated with currentTeam[p].type1
        if (currentTeam[p].type2) {
            $('#teamTypingsTable td[data-type="' + currentTeam[p].type2.toLowerCase() + '"]').append('<img class="baby-image" src="' + currentTeam[p].spriteURL + '"></img>');
            // add '<img class="tiny-image" src="' + currentTeam[p].spriteURL + '"></img>' to the row associated with currentTeam[p].type2
        }

        for (var t in currentTeam[p].offense) {
            if (currentTeam[p].offense[t] == 2) {
                $('#offensiveCoverageTable td[data-type="' + t + '"]').append('<img class="baby-image" src="' + currentTeam[p].spriteURL + '"></img>');
                // add '<img class="tiny-image" src="' + currentTeam[p].spriteURL + '"></img>' to the row associated with t
            }
        }

        if ($('#abilityFactor').is(':checked')) {
            for (var t in currentTeam[p].defenseA) {
                if (currentTeam[p].defenseA[t] != 1)
                    $('#weaknessesTable tr[data-type="' + t + '"] td[data-strength="' + currentTeam[p].defenseA[t] + '"]').append('<img class="baby-image" src="' + currentTeam[p].spriteURL + '"></img>');
            }
        } else {
            for (var t in currentTeam[p].defenseNA) {
                if (currentTeam[p].defenseNA[t] != 1)
                    $('#weaknessesTable tr[data-type="' + t + '"] td[data-strength="' + currentTeam[p].defenseNA[t] + '"]').append('<img class="baby-image" src="' + currentTeam[p].spriteURL + '"></img>');
            }
        }
    }

    $('#weaknessesTable tr[data-type]').each(function () {
        var sum = 0;
        sum += $(this).find('td[data-strength="0"] img').length;
        sum += $(this).find('td[data-strength="0.25"] img').length;
        sum += $(this).find('td[data-strength="0.5"] img').length;
        sum -= $(this).find('td[data-strength="2"] img').length;
        sum -= $(this).find('td[data-strength="4"] img').length;

        $(this).find('.typeDifference').html(sum);
        if (sum < 0) {
            $(this).find('.typeDifference').removeClass('type-strength').addClass('type-weakness');
        } else if (sum > 0) {
            $(this).find('.typeDifference').removeClass('type-weakness').addClass('type-strength');
        } else {
            $(this).find('.typeDifference').removeClass('type-strength').removeClass('type-weakness');
        }
    });
}

function getSpriteURL(curMon) {
    var spriteURL = "";
    console.log(curMon);
    if (curMon.num < 810) {
        spriteURL += "https://projectpokemon.org/images/normal-sprite/";
        if (curMon.name.endsWith("-Mega")) {
            spriteURL += curMon.id.substr(0, curMon.id.length - 4);
            spriteURL += "-mega";
        } else if (curMon.name.endsWith("-Mega-X")) {
            spriteURL += curMon.id.substr(0, curMon.id.length - 5);
            spriteURL += "-megax";
        } else if (curMon.name.endsWith("-Mega-Y")) {
            spriteURL += curMon.id.substr(0, curMon.id.length - 5);
            spriteURL += "-megay";
        } else if (curMon.name.startsWith("Mr")) {
            if (curMon.name == "Mr. Mime-Galar") {
                spriteURL += 'mr.-mime-galar';
            } else {
                spriteURL += curMon.id.substr(0, 2);
                spriteURL += ".";
                spriteURL += curMon.id.substr(2);
            }
        } else if (curMon.name.endsWith("-Alola")) {
            spriteURL += curMon.id.substr(0, curMon.id.length - 5);
            spriteURL += "-alola";
        } else if (curMon.name.endsWith("-Galar")) {
            spriteURL += curMon.id.substr(0, curMon.id.length - 5);
            spriteURL += "-galar";
        } else if (curMon.num == 773 && curMon.id != "silvally") {
            spriteURL += "silvally-";
            spriteURL += curMon.id.substr(8);
        } else if (curMon.num == 493 && curMon.id != "arceus") {
            spriteURL += "arceus-";
            spriteURL += curMon.id.substr(6);
        } else {
            spriteURL += curMon.id;
        }

    } else {
        spriteURL += "https://projectpokemon.org/images/sprites-models/swsh-normal-sprites/";
        spriteURL += curMon.id;
    }
    spriteURL += ".gif";
    console.log(spriteURL);
    curMon.spriteURL = spriteURL;
    return curMon;
}

function getLearnsets() {
    return $.ajax({
        dataType: 'json',
        url: './data/learnsets.json',
        success: function(data) {
            learnsets = data;
        }
    });
}

function getPokemon() {
    $.ajax({
        dataType: 'json',
        url: './data/pokedex.json',
        success: function(data) {
            pokemon = data;
        }
    });
}

function getMoves() {
    $.ajax({
        dataType: 'json',
        url: './data/moves.json',
        success: function(data) {
            moves = data;
        }
    });
}