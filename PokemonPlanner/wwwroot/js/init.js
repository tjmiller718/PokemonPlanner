var learnsets;
var pokemon;
var moves;
var counter = 0;
var selectedTrigger = false;

var selectedPokemon;
//var selectedTeam;
var selectSavedTeams;

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
            populateContainers();
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
                    '<div class="pokemon-box-wrapper" data-pokemonid="' + currentMon.id + '">' + (currentMon.name == 'Urshifu-Rapid-Strike' ? 'Urshifu-R' : currentMon.name) +
                    '<div class="pokemon-box" data-pokemonid="' + currentMon.id + '">' +
                    '<span class="image-helper"></span>' +
                    '<img class="medium-image" title="' + currentMon.name + '" src="' + currentMon.spriteURL + '"></img>' +
                    '</div>' +
                    '<span class="pokemonTrashCan"><i class="fa fa-trash clickable"></i></span>' +
                    '</div>');

                currentTeam.push(currentMon);
                counter++;

                addPokemonRowEvents()
                populateContainers();
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
            $('#myModal').modal('show');
        });

        $('#saveTeam').on('click', function () {
            if (currentTeam.length == 0) {
                alert('No Pokemon are currently selected.');
            } else {
                $('#saveModal').modal();
            }
        });

        $('#saveModalSave').on('click', function () {
            var teamName = $('#saveModalInput').val();
            //console.log(teamName);
            var teamJSON = JSON.stringify(currentTeam);
            localStorage.setItem(teamName, teamJSON);

            $('#saveModal').modal('hide');
        });

        $('#loadTeam').on('click', function () {
            var savedTeams = {}, // Notice change here
                keys = Object.keys(localStorage),
                i = keys.length;

            while (i--) {
                savedTeams[keys[i]] = localStorage.getItem(keys[i]);
            }

            selectSavedTeams = [];

            for (var t in savedTeams) {
                selectSavedTeams.push({ 'id': t, 'text': t, 'val': savedTeams[t] })
            }

            $('#loadModalTeams').select2({
                data: selectSavedTeams,
            });

            $('#loadModal').modal();
        });

        $('#loadModalLoad').on('click', function () {
            for (var t in selectSavedTeams) {
                if (selectSavedTeams[t].id == $('#loadModalTeams').val()) {
                    currentTeam = JSON.parse(selectSavedTeams[t].val);
                    $('#littleD').hide();
                    $('#container3').show();
                    $('#container4').show();
                    $('#abilityCheckboxDiv').show();
                    populateContainers();
                    $('#currentTeamRow .pokemon-box-wrapper').remove();
                    for (var p in currentTeam) {
                        $('#currentTeamRow').append(
                            '<div class="pokemon-box-wrapper" data-pokemonid="' + currentTeam[p].id + '">' + (currentTeam[p].name == 'Urshifu-Rapid-Strike' ? 'Urshifu-R' : currentTeam[p].name) +
                            '<div class="pokemon-box" data-pokemonid="' + currentTeam[p].id + '">' +
                            '<span class="image-helper"></span>' +
                            '<img class="medium-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>' +
                            '</div>' +
                            '<span class="pokemonTrashCan"><i class="fa fa-trash clickable"></i></span>' +
                            '</div>');
                    }
                    addPokemonRowEvents();
                }
            }
            //console.log(currentTeam);
            $('#loadModal').modal('hide');
        });

        $('#loadModalDelete').on('click', function () {
            localStorage.removeItem($('#loadModalTeams').val());

            var savedTeams = {}, // Notice change here
                keys = Object.keys(localStorage),
                i = keys.length;

            while (i--) {
                savedTeams[keys[i]] = localStorage.getItem(keys[i]);
            }

            selectSavedTeams = [];

            for (var t in savedTeams) {
                selectSavedTeams.push({ 'id': t, 'text': t, 'val': savedTeams[t] })
            }

            $('#loadModalTeams').select2({
                data: selectSavedTeams,
            });
        });

        $('#clearTeam').on('click', function () {
            currentTeam = [];
            $('#currentTeamRow .pokemon-box-wrapper').remove();
            $('#littleD').show();
            $('#container3').hide();
            $('#container4').hide();
            $('#abilityCheckboxDiv').hide();
        });
    });
});

function addPokemonRowEvents() {
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

        populateContainers();

        if (currentTeam.length == 0) {
            $('#littleD').show();
            $('#container3').hide();
            $('#container4').hide();
            $('#abilityCheckboxDiv').hide();
        }
    });

    $('.pokemon-box').off('click').on('click', function () {
        selectedPokemon = pokemon[$(this).data('pokemonid')];
        $('#pokemonListDropdown').val(selectedPokemon.id).trigger('change');
        $(this).addClass('pokemon-selected');
    });
}

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
                '<td><img class="tiny-image" title="' + sortedTeam[p].name + '" src="' + sortedTeam[p].spriteURL + '"></img></td>' +
                '<td>' + sortedTeam[p].spe + '</td>' +
                '</tr>')
        }
    }
    else
        return;
}

function populateContainers() {
    populateSpeedTiersTable();

    $('#teamTypingsTable td[data-type]').html('');
    $('#offensiveCoverageTable td[data-type]').html('');
    $('#importantMovesTable td[data-type]').html('');
    $('#weaknessesTable td[data-strength]').html('');
    $('#weaknessesTable .typeDifference').html('');

    for (var p in currentTeam) {
        $('#teamTypingsTable td[data-type="' + currentTeam[p].type1.toLowerCase() + '"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        // add '<img class="tiny-image" src="' + currentTeam[p].spriteURL + '"></img>' to the row associated with currentTeam[p].type1
        if (currentTeam[p].type2) {
            $('#teamTypingsTable td[data-type="' + currentTeam[p].type2.toLowerCase() + '"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            // add '<img class="tiny-image" src="' + currentTeam[p].spriteURL + '"></img>' to the row associated with currentTeam[p].type2
        }

        for (var t in currentTeam[p].offense) {
            if (currentTeam[p].offense[t] == 2) {
                $('#offensiveCoverageTable td[data-type="' + t + '"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
                // add '<img class="tiny-image" src="' + currentTeam[p].spriteURL + '"></img>' to the row associated with t
            }
        }

        if ($('#abilityFactor').is(':checked')) {
            for (var t in currentTeam[p].defenseA) {
                if (currentTeam[p].defenseA[t] != 1)
                    $('#weaknessesTable tr[data-type="' + t + '"] td[data-strength="' + currentTeam[p].defenseA[t] + '"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            }
        } else {
            for (var t in currentTeam[p].defenseNA) {
                if (currentTeam[p].defenseNA[t] != 1)
                    $('#weaknessesTable tr[data-type="' + t + '"] td[data-strength="' + currentTeam[p].defenseNA[t] + '"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            }
        }
        var moveMonCounter = 0;
        var currentMonID = currentTeam[p].id;
        if (currentTeam[p].name.endsWith('-Mega'))
            currentMonID = currentMonID.substring(0, currentMonID.length - 4);
        else if (currentTeam[p].name.endsWith('-Mega-Y'))
            currentMonID = currentMonID.substring(0, currentMonID.length - 5);
        else if (currentTeam[p].name.endsWith('-Mega-X'))
            currentMonID = currentMonID.substring(0, currentMonID.length - 5);
        
        if (learnsets[currentMonID].includes('stealthrock'))
            $('#importantMovesTable td[data-type="rocks"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('stealthrock'))
                $('#importantMovesTable td[data-type="rocks"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('stealthrock'))
                    $('#importantMovesTable td[data-type="rocks"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        if (learnsets[currentMonID].includes('spikes'))
            $('#importantMovesTable td[data-type="spikes"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('spikes'))
                $('#importantMovesTable td[data-type="spikes"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('spikes'))
                    $('#importantMovesTable td[data-type="spikes"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        if (learnsets[currentMonID].includes('toxicspikes'))
            $('#importantMovesTable td[data-type="tspikes"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('toxicspikes'))
                $('#importantMovesTable td[data-type="tspikes"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('toxicspikes'))
                    $('#importantMovesTable td[data-type="tspikes"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        if (learnsets[currentMonID].includes('stickyweb'))
            $('#importantMovesTable td[data-type="webs"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('stickyweb'))
                $('#importantMovesTable td[data-type="webs"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('stickyweb'))
                    $('#importantMovesTable td[data-type="webs"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        if (learnsets[currentMonID].includes('defog') || learnsets[currentMonID].includes('rapidspin'))
            $('#importantMovesTable td[data-type="defog"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('defog') || learnsets[currentTeam[p].evo1].includes('rapidspin'))
                $('#importantMovesTable td[data-type="defog"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('defog') || learnsets[currentTeam[p].evo1].includes('rapidspin'))
                    $('#importantMovesTable td[data-type="defog"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        if (learnsets[currentMonID].includes('healbell') || learnsets[currentMonID].includes('aromatherapy'))
            $('#importantMovesTable td[data-type="healbell"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('healbell'))
                $('#importantMovesTable td[data-type="healbell"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('healbell'))
                    $('#importantMovesTable td[data-type="healbell"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        if (learnsets[currentMonID].includes('wish'))
            $('#importantMovesTable td[data-type="wish"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (learnsets[currentTeam[p].evo1].includes('wish'))
                $('#importantMovesTable td[data-type="wish"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (learnsets[currentTeam[p].evo2].includes('wish'))
                    $('#importantMovesTable td[data-type="wish"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        var recoveryArray = ['roost', 'softboiled', 'recover', 'moonlight', 'morningsun', 'synthesis', 'milkdrink', 'healorder', 'slackoff', 'shoreup'];
        if (recoveryArray.some(m => learnsets[currentMonID].includes(m)))
            $('#importantMovesTable td[data-type="recovery"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (recoveryArray.some(m => learnsets[currentTeam[p].evo1].includes(m)))
                $('#importantMovesTable td[data-type="recovery"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (recoveryArray.some(m => learnsets[currentTeam[p].evo2].includes(m)))
                    $('#importantMovesTable td[data-type="recovery"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        var pivotingArray = ['uturn', 'voltswitch', 'flipturn', 'teleport', 'partingshot'];
        if (pivotingArray.some(m => learnsets[currentMonID].includes(m)))
            $('#importantMovesTable td[data-type="pivoting"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (pivotingArray.some(m => learnsets[currentTeam[p].evo1].includes(m)))
                $('#importantMovesTable td[data-type="pivoting"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (pivotingArray.some(m => learnsets[currentTeam[p].evo2].includes(m)))
                    $('#importantMovesTable td[data-type="pivoting"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');

        var priorityArray = ['fakeout', 'extremespeed', 'firstimpression', 'accelerock', 'aquajet', 'bulletpunch', 'iceshard', 'machpunch', 'quickattack', 'shadowsneak',
            'suckerpunch', 'vacuumwave', 'watershuriken'];
        if (priorityArray.some(m => learnsets[currentMonID].includes(m)))
            $('#importantMovesTable td[data-type="priority"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
        else if (currentTeam[p].hasOwnProperty('evo1'))
            if (priorityArray.some(m => learnsets[currentTeam[p].evo1].includes(m)))
                $('#importantMovesTable td[data-type="priority"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
            else if (currentTeam[p].hasOwnProperty('evo2'))
                if (priorityArray.some(m => learnsets[currentTeam[p].evo2].includes(m)))
                    $('#importantMovesTable td[data-type="priority"]').append('<img class="baby-image" title="' + currentTeam[p].name + '" src="' + currentTeam[p].spriteURL + '"></img>');
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
    spriteURL += "https://play.pokemonshowdown.com/sprites/ani/";
    if (curMon.name == "Urshifu-Rapid-Strike")
        spriteURL += 'urshifu-rapidstrike';
    else
        spriteURL += curMon.name.toLowerCase();
    /*
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
    */
    if (curMon.name == "Kommo-o")
        spriteURL = spriteURL.replace('-', '');
    if (curMon.name == "Charizard-Mega-Y")
        spriteURL = spriteURL.replace('mega-y', 'megay');
    if (curMon.name == "Charizard-Mega-X")
        spriteURL = spriteURL.replace('mega-x', 'megax');
    spriteURL += ".gif";
    spriteURL = spriteURL.replace(' ', '');
    spriteURL = spriteURL.replace('%', '');
    spriteURL = spriteURL.replace("’", '');
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