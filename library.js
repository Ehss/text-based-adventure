
var windowText = "";
var currentLocation = "";

var locations = [];	
var moves = [];

var playerInventory = [];

var actions = [];

// Classes

class State{

	constructor(name,description)
	{
		this.name = name;
		this.description = description;
	}

	look()
	{

		return this.description;
	}

}

class Move{

	constructor(startingLocation, startingLocationStates, targetLocation, targetLocationStates, possibleCommands)
	{
		this.startingLocation = startingLocation;
		this.startingLocationStates = startingLocationStates;
		
		this.targetLocation = targetLocation;
		this.targetLocationStates = targetLocationStates;
		
		this.possibleCommands = possibleCommands;
	}


}

class Item{

	constructor(name)
	{
		this.name = name;
		this.states = [];

		this.activeState = 0;
	}

	look()
	{
		return this.states[this.activeState].look();
	}
	addState(state)
	{
		for (var x = 0; x < this.states.length; x++)
		{
			if (this.states[x].name == state.name)
			{
				this.states[x].description = state.description;
				console.log("State already Exists, replaced description of '" + this.name + " - " + state.name);
				return;
			}
		}
		this.states.push(state);
	}

}

class Location{

	constructor(name)
	{
		this.name = name;
		this.states = [];
		this.items = [];

		this.activeState = 0;
	}

	addItem(item)
	{
		this.items.push(item);
	}

	addState(state)
	{
		for (var x = 0; x < this.states.length; x++)
		{
			if (this.states[x].name == state.name)
			{
				this.states[x].description = state.description;
				console.log("State already Exists, replaced description of '" + this.name + " - " + state.name);
				return;
			}
		}
		this.states.push(state);
	}

	look()
	{
		return this.states[this.activeState].look();
	}

	changeToState(newState)
	{
		for (var x = 0; x < this.states.length; x++)
		{
			if (this.states[x].name == newState)
			{
				this.activeState = x;
				return;
			}
		}
		console.log(this.name + " does not have a state of '" + newState + "'.");
	}

	getState()
	{
		return this.states[this.activeState].name;
	}
}


// Intermediary functions


function messageReceived(message, messages)
{
	for (var x = 0; x < messages.length; x++)
	{
		if (messages[x].trim().toLowerCase() == message.trim().toLowerCase())
		{
			return true;
		}
	}
	return false;
}

function findLocationIndex(location)
{	
	for (var x = 0; x < locations.length; x++)
	{
		if (locations[x].name == location)
		{
			return x;
		}
	}
}


// Add Functions - Used these to build world and interactions

/*
	
	Ready to use:
		
		Making Items
			ex: var spoon = new Item("Spoon"));
		Making Locations:
			ex: addLocation("Kitchen");
		addItemToLocation("Kitchen", spoon);
	
	Experimental: 
		addAction(location, pieces);
	
*/

function addAction(location, pieces)
{
	/*
		pieces will be like -> [typeOfPossibleAction,[actionPieces],requiredState,requiredItem[],possibleTexts[],otherActions[]]
		the amount of pieces are context sensitive, but based on pieces[0], it'll be carried out appropriately
		
		eg. 
		addAction("Garden",["changeRoomState",["HoleDug"],"Normal",["Shovel"],["Dig hole","Use Shovel to dig hole."]]);
		The logic here is that we are in the Garden.
		We want to change the state of the Garden from state "Normal" to state "HoleDug".
		The "Shovel" is required, and no other item is required. 
		Possible commands will be "Dig Hole" and "Use Shovel to dig hole." (this is not an exhaustive list here).
		In all actions, the back end will check the location and see if it matches the player's current location.
		If it does, it'll check the current text and see if it matches one of the possible texts found in the action.
		If it does, it'll check the required state and items (if required). 
		If all checks out, it'll carry out the action. 
		This whole function may get more complicated by the addition of error statements, along the line of 
		No shovel = "You don't have anything to dig with!"
		Wrong state = "You already dug a hole!"
		- Actually, it might be better to have a function "errorStatement" that will be looked at when all else fails
		Other Examples:
		Opening a door:
		addAction("HouseInterior",["changeRoomState",["DoorOpen"],"FrontDoorClosed",[],["Open Door","Open the door."]]);
		
		Using a match to light a candle:
		addAction("Candle",["changeItemState",["LitCandle"],"",["Candle","Match"],[Light Candle","Use Match on Candle"],]);
		
		This is still a concept in progress, and may see other iterations. 
		
	*/
}

function addLocations(names)
{
	for (var x = 0; x < names.length; x++)
	{
		locations.push(new Location(names[x]));
		
	}
}

function addItemToLocation(item, location)
{
	locations[findLocationIndex(location)].addItem(item);
}

function addMove(currentLocation, states, secondaryLocation, states, commands)
{
	moves.push(new Move(currentLocation, states, secondaryLocation, states, commands));
	// moving from one place to another
	//
	// Ex:
	// addMove("HouseInterior", ["DoorOpen"], "Garden", ["Normal"], ["Go outside","Go south"]);
}	

function addStateDescripToLocation(location, state, description)
{
	for (var x = 0; x < locations.length; x++)
	{
		if (locations[x].name == location)
		{
			locations[x].states.push(new State(state, description));	
		}
	}
}

// In Game Functions

function lookAtRoom()
{
	var description = getCurrentLocation().look();
	
	if (getCurrentLocation().items.length > 0)
	{
		description += "<br><br>You see: ";
		for (var x = 0; x < getCurrentLocation().items.length; x++)
		{
			description += "<br>" + getCurrentLocation().items[x].name;
		}
	}

	write(description);	
}

function write(n)
{
	document.getElementById("consoleText").innerHTML = "<p>" + n + "</p>";
	//document.getElementById("consoleText").innerHTML += "<p>" + n + "</p>";
}



function getCurrentLocation()
{
	for (var x = 0; x < locations.length; x++)
	{
		if (currentLocation == locations[x].name)
		{
			return locations[x];
		}
	}


}

function getLocation(name)
{
	for (var x = 0; x < locations.length; x++)
	{
		if (name == locations[x].name)
		{
			return locations[x];
		}
	}
}


var audioDistances = [];


function tryToMove()
{
	for (var x = 0; x < moves.length; x++)
	{
		if (currentLocation == moves[x].startingLocation)
		{ 
			for(var z = 0; z < moves[x].possibleCommands.length; z++)
			{
				if (formated(userInput) == formated(moves[x].possibleCommands[z]))
				{
					for (var y = 0; y < moves[x].startingLocationStates.length; y++)
					{
						if (getState(currentLocation).name == moves[x].startingLocationStates[y])
						{
							for (var a = 0; a < moves[x].targetLocationStates.length; a++)
							{
								if (getState(moves[x].targetLocation).name == moves[x].targetLocationStates[a])
								{
									currentLocation = moves[x].targetLocation;

									for (var x = 0; x < audioDistances.length; x++)
									{
										console.log(currentLocation,audioDistances[x][0]);
										if (currentLocation == audioDistances[x][0])
										{
											audios[audioDistances[x][1]].volume = audioDistances[x][2];
										}
									}
									
									makeImage();

									return true;
								}
							}
						}
					}
				}
			}
			
		}
	}

	return false;
}

function makeImage()
{
	document.getElementById("image").src="";

	if (canSee)
	{
		for (var x = 0; x < pictures.length; x++)
		{

			if (pictures[x].location == getCurrentLocation().name)
			{
				document.getElementById("image").src=pictures[x].fileName;
				return;
			}
			
		}
	}
	
}

function playAudio(name)
{
	if (canHear)
	{
		var audio = new Audio(name);
		audio.play();
	}
	
}

class Picture{

	constructor(location,fileName)
	{
		this.location = location;
		this.fileName = fileName;
	}

}

function addPicture(location, fileName)
{
	pictures.push(new Picture(location,fileName));
}


var pictures = [];
var canSee = true; // starts false

function getState(location)
{	
	var loc = getLocation(location);
	return loc.states[loc.activeState];
}

function interpretText()
{
	var text = formated(userInput);
	if (text.startsWith("get ") || text.startsWith("take "))
	{
		if (text.startsWith("get "))
		{
			text = text.substring(4, text.length);
		}
		else if (text.startsWith("take "))
		{
			text = text.substring(5, text.length);
		}

		for (var x = 0; x < getCurrentLocation().items.length; x++)
		{
			if (text == formated(getCurrentLocation().items[x].name))
			{
				playerInventory.push(getCurrentLocation().items[x]);
				write("You got the " + formated(getCurrentLocation().items[x].name) + ".");
				getCurrentLocation().items.splice(x,1);
				playSound("open-door.mp3");
				return;
			}
		}
		write("I don't see the " + text + ".");
		return;
	}	
	else if (text.startsWith("drop "))
	{
		text = text.substring(5	, text.length);
		for (var x = 0; x < playerInventory.length; x++)
		{
			if (text == formated(playerInventory[x].name))
			{
				getCurrentLocation().addItem(playerInventory[x]);
				write("You dropped the " + formated(playerInventory[x].name) + ".");
				playerInventory.splice(x,1);
				playSound("close-door.mp3");
				return;
			}
		}
		write("You don't have the " + text + ".");
		return;
	}
	else if (text.startsWith("check ") || text.startsWith("look at "))
	{
		if (text.startsWith("check "))
		{
			text = text.substring(6	, text.length);
		}
		else if (text.startsWith("look at "))
		{
			text = text.substring(8	, text.length);
		}
		
		var item = itemInArea(text);
		if (item != null)
		{
			write(item.look());
			return;
		}
		else
		{
			write("There is no " + text + " to look at.");
			return;
		}
	}
	else if (text == "look")
	{
		lookAtRoom();
		return;
	}
	else if (tryToMove())
	{
		lookAtRoom();
		return;
	}
	else if (isDirectionalMove(text))
	{
		write("You cannot move that way.");
		return;
	}
	else if (text == "look at inventory" || text == "inventory")
	{
		if (playerInventory.length > 0)
		{
			write("You are carrying:");

			var itemText = "";
			for (var x = 0; x < playerInventory.length; x++)
			{
				if (x != 0)
				{
					itemText += ", ";
				}
				itemText += playerInventory[x].name;
			}
			write(itemText);
			return;
		}
		else
		{
			write ("You are carrying nothing.");
			return;
		}
	}
	else
	{
		var tripped = false;
		console.log(actions.length);
		for (var x = 0; x < actions.length; x++)
		{
			var action = actions[x];
			for(var y = 0; y < action[2].length; y++)
			{
				if (text == action[2][y])
				{
					tripped = true;
					break;
				}
				tripped = false;
			}
			if (tripped)
			{
				//checking conditions
				var conditionsMet = true;
				var conditions = action[0];
				for (var y = 0; y < conditions.length; y++)
				{
					if (conditions[y][0] == "itemInArea")
					{
						if (itemInArea(conditions[y][1]))
						{
							break;
						}
						else
						{
							write("There is no " + conditions[y][1] + " here.");
							return;
						}
					}

					else if (conditions[y][0] == "currentLocation")
					{
						if (getCurrentLocation().name == conditions[y][1])
						{
							break;
						}
						else
						{
							write("Sorry, I don't understand");
							return;
						}
					}

					else if (conditions[y][0] == "locationState")
					{	
						var stateMet = false;
						for (var z = 0; z < conditions[y][2].length; z++)
						{
							if (conditions[y][2][z] == getLocation(conditions[y][1]).getState())
							{
								stateMet = true;
								break;
							}
						}
						if (!stateMet)
						{
							write("You can't do that now.");
							return;
						}

					}
					else if (conditions[y][0] == "checkVar")
					{
						if (conditions[y][1] == "musicOneStatus")
						{
							for (var z = 0; z < conditions[y][2].length; z++)
							{
								if (conditions[y][2][z] == musicOneStatus)
								{
									break;
								}
							}
							write("You can't do that now.")
							return;
						}
					}
					// other conditions

				}

				// all conditions met

				var results = action[1];

				for (var y = 0; y < results.length; y++)
				{
					if (results[y][0] == "changeLocationState")
					{
						getLocation(results[y][1]).changeToState(results[y][2]);
					}
					else if (results[y][0] == "playMusic")
					{
						if (results[y][1] == "musicOne")
						{
							audios[0].play();
							musicOneStatus = "playing";
						}
					}
					else if (results[y][0] == "stopMusic")
					{
						if (results[y][1] == "musicOne")
						{
							audios[0].pause();
							audios[0].currentTime = 0;
							
						}
					}

					else if (results[y][0] == "pauseMusic")
					{
						if (results[y][1] == "musicOne")
						{
							audios[0].pause();
						}
					}

					// other results

				}

				write(actions[x][3]);	
				return;

			}
		}

		write("A Sorry, I don't understand");
		return;
	}


	
	write("Sorry, I don't understand");
	return;

}

var musicOnePlaying = "stopped";


var moveDirections = ["go west","go east","go south","go north","go up","go down",
"go southeast","go southwest","go northeast","go northwest",
"go south east","go south west","go north east","go north west",
"move west","move east","move south","move north","move up","move down",
"move southeast","move southwest","move northeast","move northwest",
"move south east","move south west","move north east","move north west",
"west","east","south","north","up","down",
"southeast","southwest","northeast","northwest",
"south east","south west","north east","north west",
"w","e","s","n","u","d","se","sw","ne","nw","se","sw","ne","nw",

]
function isDirectionalMove(n)
{	
	for(var x = 0; x < moveDirections.length; x++)
	{
		if (n == moveDirections[x])
		{
			return true;
		}
	}
	return false;
}

function itemInArea(name)
{
	for (var x = 0; x < getCurrentLocation().items.length; x++)
	{
		if (formated(getCurrentLocation().items[x].name) == formated(name))
		{
			return getCurrentLocation().items[x];
		}
	}
	for (var x = 0; x < playerInventory.length; x++)
	{
		if (formated(playerInventory[x].name) == formated(name))
		{
			return playerInventory[x];
		}
	}

	return null;
}


function formated(n)
{
	return n.trim().toLowerCase().replace(/[.,\/#?!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
}

function addPossibleAction(conditions,results,thingsToCarryOut,successMessage)
{
	actions.push([conditions,results,thingsToCarryOut,successMessage]);

}

var audios = [];

function stopSounds()
{
	for (var x = 0; x < audios.length; x++)
	{
		audios[x].pause();
		audios[x].currentTime = 0;
		audios.splice(x,1);
		x--;
	}
}

function playSound(name)
{
	audios.push(new Audio(name));
	audios[audios.length-1].play();
}

function changeMasterVolume(amount)
{
	for (var x = 0; x < audios.length; x++)
	{
		audios[x].volume = amount;
	}
}

//////////////////////////////////////////////
////////////// Start the Game/////////////////
//////////////////////////////////////////////

var userInput = "";

var input = document.getElementById("myInput");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Cancel the default action, if needed
  event.preventDefault();
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Trigger the button element with a click
    userInput = document.getElementById("myInput").value;
    document.getElementById("recentInput").innerHTML = "<p>"+userInput+"</p>";
    write("<span class='userInput'>"+userInput+"</span>");
    userInput = formated(userInput);

    document.getElementById("myInput").value = "";
    interpretText();
  }
});



