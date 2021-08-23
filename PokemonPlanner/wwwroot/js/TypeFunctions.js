// return
//  -array of weaknesses 
//  -array of resists
//  -array of immunities
//  -the 3 above things with respect to abilities
//  -offensive (stab) super effective coverage
function analyzeType(pokemon) {
    //var weakNA = [], resNA = [], immNA = [], weakA = [], resNA = [], immNA = [], strong = [];

    pokemon.defenseNA = defensiveMatchups(pokemon, false);
    pokemon.defenseA = defensiveMatchups(pokemon, true);
    pokemon.offense = offensiveMatchups(pokemon);

    return pokemon;
}

function defensiveMatchups(pokemon, abilityFlag) {
    var typeMatchups = {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 1,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    };

    var a1 = pokemon.ability1;
    var a2 = pokemon.ability2;
    var a3 = pokemon.abilityH;

    if (abilityFlag) {
        if (a1 == 'Dry Skin' || a2 == 'Dry Skin' || a3 == 'Dry Skin')
            typeMatchups.water *= 0;
        if (a1 == 'Flash Fire' || a2 == 'Flash Fire' || a3 == 'Flash Fire')
            typeMatchups.fire *= 0;
        if (a1 == 'Fluffy' || a2 == 'Fluffy' || a3 == 'Fluffy')
            typeMatchups.fire *= 2;
        if (a1 == 'Heatproof' || a2 == 'Heatproof' || a3 == 'Heatproof')
            typeMatchups.fire *= 0.5;
        if (a1 == 'Levitate' || a2 == 'Levitate' || a3 == 'Levitate')
            typeMatchups.ground *= 0;
        if (a1 == 'Lightning Rod' || a2 == 'Lightning Rod' || a3 == 'Lightning Rod')
            typeMatchups.electric *= 0;
        if (a1 == 'Motor Drive' || a2 == 'Motor Drive' || a3 == 'Motor Drive')
            typeMatchups.electric *= 0;
        if (a1 == 'Sap Sipper' || a2 == 'Sap Sipper' || a3 == 'Sap Sipper')
            typeMatchups.grass *= 0;
        if (a1 == 'Storm Drain' || a2 == 'Storm Drain' || a3 == 'Storm Drain')
            typeMatchups.water *= 0;
        if (a1 == 'Thick Fat' || a2 == 'Thick Fat' || a3 == 'Thick Fat') {
            typeMatchups.fire *= 0.5;
            typeMatchups.ice *= 0.5;
        }
        if (a1 == 'Volt Absorb' || a2 == 'Volt Absorb' || a3 == 'Volt Absorb')
            typeMatchups.electric *= 0;
        if (a1 == 'Water Absorb' || a2 == 'Water Absorb' || a3 == 'Water Absorb')
            typeMatchups.water *= 0;
        if (a1 == 'Water Bubble' || a2 == 'Water Bubble' || a3 == 'Water Bubble')
            typeMatchups.fire *= 0.5;
    }
    var x = 0;
    var typeCurrent = pokemon.type1;
    while (x < 2) {
        switch (typeCurrent) {
            case 'Normal':
                typeMatchups.fighting *= 2;
                typeMatchups.ghost *= 0;
                break;
            case 'Fire':
                typeMatchups.fire *= 0.5;
                typeMatchups.water *= 2;
                typeMatchups.grass *= 0.5;
                typeMatchups.ice *= 0.5;
                typeMatchups.ground *= 2;
                typeMatchups.bug *= .5;
                typeMatchups.rock *= 2;
                typeMatchups.steel *= .5;
                typeMatchups.fairy *= .5;
                break;
            case 'Water':
                typeMatchups.fire *= .5;
                typeMatchups.water *= .5;
                typeMatchups.electric *= 2;
                typeMatchups.grass *= 2;
                typeMatchups.ice *= .5;
                typeMatchups.steel *= .5;
                break;
            case 'Electric':
                typeMatchups.electric *= .5;
                typeMatchups.ground *= 2;
                typeMatchups.flying *= .5;
                typeMatchups.steel *= .5;
                break;
            case 'Grass':
                typeMatchups.fire *= 2;
                typeMatchups.water *= .5;
                typeMatchups.electric *= .5;
                typeMatchups.grass *= .5;
                typeMatchups.ice *= 2;
                typeMatchups.poison *= 2;
                typeMatchups.ground *= .5;
                typeMatchups.flying *= 2;
                typeMatchups.bug *= 2;
                break;
            case 'Ice':
                typeMatchups.fire *= 2;
                typeMatchups.ice *= .5;
                typeMatchups.fighting *= 2;
                typeMatchups.rock *= 2;
                typeMatchups.steel *= 2;
                break;
            case 'Fighting':
                typeMatchups.flying *= 2;
                typeMatchups.psychic *= 2;
                typeMatchups.bug *= .5;
                typeMatchups.rock *= .5;
                typeMatchups.fairy *= 2;
                break;
            case 'Poison':
                typeMatchups.grass *= .5;
                typeMatchups.fighting *= .5;
                typeMatchups.poison *= .5;
                typeMatchups.ground *= 2;
                typeMatchups.psychic *= 2;
                typeMatchups.bug *= .5;
                typeMatchups.fairy *= .5;
                break;
            case 'Ground':
                typeMatchups.water *= 2;
                typeMatchups.electric *= .5;
                typeMatchups.grass *= 2;
                typeMatchups.ice *= 2;
                typeMatchups.poison *= .5;
                typeMatchups.rock *= .5;
                break;
            case 'Flying':
                typeMatchups.electric *= 2;
                typeMatchups.grass *= .5;
                typeMatchups.ice *= 2;
                typeMatchups.fighting *= .5;
                typeMatchups.ground *= 0;
                typeMatchups.bug *= .5;
                typeMatchups.rock *= 2;
                break;
            case 'Psychic':
                typeMatchups.fighting *= .5;
                typeMatchups.psychic *= .5;
                typeMatchups.bug *= 2;
                typeMatchups.ghost *= 2;
                typeMatchups.dark *= 2;
                break;
            case 'Bug':
                typeMatchups.fire *= 2;
                typeMatchups.grass *= .5;
                typeMatchups.fighting *= .5;
                typeMatchups.ground *= .5;
                typeMatchups.flying *= 2;
                typeMatchups.rock *= 2;
                break;
            case 'Rock':
                typeMatchups.normal *= .5;
                typeMatchups.fire *= .5;
                typeMatchups.water *= 2;
                typeMatchups.grass *= 2;
                typeMatchups.fighting *= 2;
                typeMatchups.poison *= .5;
                typeMatchups.ground *= 2;
                typeMatchups.flying *= .5;
                typeMatchups.steel *= 2;
                break;
            case 'Ghost':
                typeMatchups.normal *= 0;
                typeMatchups.fighting *= 0;
                typeMatchups.poison *= .5;
                typeMatchups.bug *= .5;
                typeMatchups.ghost *= 2;
                typeMatchups.dark *= 2;
                break;
            case 'Dragon':
                typeMatchups.fire *= .5;
                typeMatchups.water *= .5;
                typeMatchups.electric *= .5;
                typeMatchups.grass *= .5;
                typeMatchups.ice *= 2;
                typeMatchups.dragon *= 2;
                typeMatchups.fairy *= 2;
                break;
            case 'Dark':
                typeMatchups.fighting *= 2;
                typeMatchups.psychic *= 0;
                typeMatchups.bug *= 2;
                typeMatchups.ghost *= .5;
                typeMatchups.dark *= .5;
                typeMatchups.fairy *= 2;
                break;
            case 'Steel':
                typeMatchups.normal *= .5;
                typeMatchups.fire *= 2;
                typeMatchups.grass *= .5;
                typeMatchups.ice *= .5;
                typeMatchups.fighting *= 2;
                typeMatchups.poison *= 0;
                typeMatchups.ground *= 2;
                typeMatchups.flying *= .5;
                typeMatchups.psychic *= .5;
                typeMatchups.bug *= .5;
                typeMatchups.rock *= .5;
                typeMatchups.dragon *= .5;
                typeMatchups.steel *= .5;
                typeMatchups.fairy *= .5;
                break;
            case 'Fairy':
                typeMatchups.fighting *= .5;
                typeMatchups.poison *= 2;
                typeMatchups.bug *= .5;
                typeMatchups.dragon *= 0;
                typeMatchups.dark *= .5;
                typeMatchups.steel *= 2;
                break;
            default:
                break;
        }
        typeCurrent = pokemon.type2;
        x++;
    } 
    
    if (abilityFlag && (a1 == 'Wonder Guard' || a2 == 'Wonder Guard' || a3 == 'Wonder Guard')) {
        for (var x in typeMatchups)
            if (typeMatchups[x] != 2 && typeMatchups[x] != 4)
                typeMatchups[x] = 0;
    }

    return typeMatchups;
    //console.log(typeMatchups);
}

function offensiveMatchups(pokemon) {
    var typeMatchups = {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 1,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    };

    var x = 0;
    var typeCurrent = pokemon.type1;
    while (x < 2) {
        switch (typeCurrent) {
            case 'Normal':
                break;
            case 'Fire':
                typeMatchups.grass = 2;
                typeMatchups.ice = 2;
                typeMatchups.bug = 2;
                typeMatchups.steel = 2;
                break;
            case 'Water':
                typeMatchups.fire = 2;
                typeMatchups.ground = 2;
                typeMatchups.rock = 2;
                break;
            case 'Electric':
                typeMatchups.water = 2;
                typeMatchups.flying = 2;
                break;
            case 'Grass':
                typeMatchups.water = 2;
                typeMatchups.ground = 2;
                typeMatchups.rock = 2;
                break;
            case 'Ice':
                typeMatchups.grass = 2;
                typeMatchups.flying = 2;
                typeMatchups.ground = 2;
                typeMatchups.dragon = 2;
                break;
            case 'Fighting':
                typeMatchups.normal = 2;
                typeMatchups.ice = 2;
                typeMatchups.rock = 2;
                typeMatchups.steel = 2;
                typeMatchups.dark = 2;
                break;
            case 'Poison':
                typeMatchups.grass = 2;
                typeMatchups.fairy = 2;
                break;
            case 'Ground':
                typeMatchups.fire = 2;
                typeMatchups.electric = 2;
                typeMatchups.rock = 2;
                typeMatchups.poison = 2;
                typeMatchups.steel = 2;
                break;
            case 'Flying':
                typeMatchups.grass = 2;
                typeMatchups.bug = 2;
                typeMatchups.fighting = 2;
                break;
            case 'Psychic':
                typeMatchups.fighting = 2;
                typeMatchups.poison = 2;
                break;
            case 'Bug':
                typeMatchups.grass = 2;
                typeMatchups.psychic = 2;
                typeMatchups.dark = 2;
                break;
            case 'Rock':
                typeMatchups.fire = 2;
                typeMatchups.ice = 2;
                typeMatchups.bug = 2;
                typeMatchups.flying = 2;
                break;
            case 'Ghost':
                typeMatchups.psychic = 2;
                typeMatchups.ghost = 2;
                break;
            case 'Dragon':
                typeMatchups.dragon = 2;
                break;
            case 'Dark':
                typeMatchups.psychic = 2;
                typeMatchups.ghost = 2;
                break;
            case 'Steel':
                typeMatchups.ice = 2;
                typeMatchups.rock = 2;
                typeMatchups.fairy = 2;
                break;
            case 'Fairy':
                typeMatchups.fighting = 2;
                typeMatchups.dragon = 2;
                typeMatchups.dark = 2;
                break;
            default:
                break;
        }
        typeCurrent = pokemon.type2;
        x++;
    }

    return typeMatchups;
}