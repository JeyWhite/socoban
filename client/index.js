const CellTypes = ["Void","Wall","Box","Base","Unit","Box_on_base", "Unit_on_base"];


class cell{
    #redrawNeeded = true; // for next upgrades to canvas
    #type
    constructor(type){
        this.#type = type;
        this.node = document.createElement('div');
        this.node.classList.add("cell");
        this.node.classList.add(this.#type);
    }
    render(fieldDiv) {
        // TODO 
        this.#redrawNeeded = false;
    }
    get Type(){
        return this.#type;
    }
    set Type(Type){
        if (this.node.classList.contains(this.#type)){
            this.node.classList.remove(this.#type);
        }
        this.#type = Type;
        this.node.classList.add(this.#type);
        this.#redrawNeeded = true;
    }  
}

class Unit {
    #directions = {"up":[-1,0],"down":[1,0],"left":[0,-1],"right":[0,1]}
    #tranUnit = {"Unit_on_base":"Base", "Unit":"Void", "Void":"Unit", "Base":"Unit_on_base"};
    #transBox = {"Box_on_base":"Base", "Box":"Void", "Void":"Box", "Base":"Box_on_base"};
    #CurrentCell
    #vpos
    #gpos
    constructor (field){
        let position = this.#findPos(field)
        this.#vpos = position[0];
        this.#gpos = position[1];
        this.#CurrentCell = field[this.#vpos][this.#gpos];
    }
    #findPos(field){
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j <field[i].length; j++){
                if (field[i][j].Type == "Unit" || field[i][j].Type == "Unit_on_base") {
                    //console.log(`couch ${i} ${j}`)
                    return [i, j]
                }
            }
        } 
    }
    #getNewPos(direction, multiplicator = 1){
        let shift = this.#directions[direction];
        return [this.#vpos + shift[0]*multiplicator,this.#gpos + shift[1]*multiplicator];
    }
    move(field, direction){
        let newPos = this.#getNewPos(direction);
        let nextCell = field[newPos[0]][newPos[1]];
        if (this.#canMove(field, direction)){
            if ( this.#CurrentCell.node.classList.contains("Unit")|| this.#CurrentCell.node.classList.contains("Unit_on_base")) {
                if (nextCell.node.classList.contains("Box") || nextCell.node.classList.contains("Box_on_base")){
                    this.#moveBox(field,direction);
                }
                if (nextCell.node.classList.contains("Void") || nextCell.node.classList.contains("Base")){ 
                    // go to void
                    this.#CurrentCell.Type = this.#tranUnit[this.#CurrentCell.Type];
                    nextCell.Type = this.#tranUnit[nextCell.Type];
                    this.#CurrentCell = nextCell;
                    this.#vpos = newPos[0];
                    this.#gpos = newPos[1];
                } 
            }
        }
    }

    #canMove(field, direction){
        //console.log("can move???")
        let newPos = this.#getNewPos(direction);
        let nextCell = field[newPos[0]][newPos[1]];
        if (nextCell.node.classList.contains("Box") || nextCell.node.classList.contains("Box_on_base")){
            return this.#canMoveBox(field,direction);
        } else if (nextCell.node.classList.contains("Wall")) {
            return false;
        }  else if (nextCell.node.classList.contains("Void") || nextCell.node.classList.contains("Base")) {
            //console.log("can move")
            return true;
        }
    }
    #canMoveBox(field,direction){
        let newPos = this.#getNewPos(direction,2);
        try {
            let nextCell = field[newPos[0]][newPos[1]];
            if (nextCell === undefined){
                return false; // out of field by gorizontal axis
            }
            if (nextCell.node.classList.contains("Void")|| nextCell.node.classList.contains("Base")) {
                //console.log("can move the box")
                return true; // yes we can 
            } else {
                return false;
            }
        } catch (error) {
            return false; // out of field by vertical axis
        }
        
    }

    #moveBox(field,direction){
        let firstPos = this.#getNewPos(direction);
        let firstCell = field[firstPos[0]][firstPos[1]];
        let secondPos = this.#getNewPos(direction,2)
        let secondCell = field[secondPos[0]][secondPos[1]];
        firstCell.Type = this.#transBox[firstCell.Type];
        secondCell.Type =this.#transBox[secondCell.Type];
    }

    enableKeys(field) {
        let obj = this
        document.addEventListener('keyup', function(event) {
            if (event.code == 'KeyW' || event.code == "ArrowUp") {
                obj.move(field, "up");
            }
        });
        document.addEventListener('keyup', function(event) {
            if (event.code == 'KeyS' || event.code == "ArrowDown") {
                obj.move(field, "down");
            }
        });
        document.addEventListener('keyup', function(event) {
            if (event.code == 'KeyA' || event.code == "ArrowLeft") {
                obj.move(field, "left");
            }
        });
        document.addEventListener('keyup', function(event) {
            if (event.code == 'KeyD' || event.code == "ArrowRight") {
                obj.move(field, "right");
            }
        });
    }
}

function loadField(){
    let file = new File
    file.name
    let reader = new FileReader();
    reader.onload = function(event) {
        let contents = event.target.result;
        console.log("Содержимое файла: " + contents);
    };
    reader.onerror = function(event) {
        console.error("Файл не может быть прочитан! код " + event.target.error.code);
    };

    reader.readAsText("client/levels/1.json");

}

function getField(fieldPattern){
    let arr = [];
    for (let i = 0; i < fieldPattern.length; i++){
        arr.push([]);
        for (let j = 0; j <fieldPattern[i].length; j++){
            arr[i].push(new cell(CellTypes[fieldPattern[i][j]]));
        }
    }
    return arr;
}

function renderField(fieldArr){
    if  (Array.isArray(fieldArr)) {
    const fieldDiv = document.querySelector('div.field');    
        for (let i = 0; i < fieldArr.length; i++) {
            let row = document.createElement('div');
            row.className = "row";
            fieldDiv.append(row)
            for (let j = 0; j <fieldArr[i].length; j++){
                // console.log(`HERE!!${i} ${j}`)
                row.append(fieldArr[i][j].node)
            }
        } 
    }
}

function runGame(){
    // todo: get level from server. I dont now how it works yet
    const fieldPattern = loadField();
    let field = getField(fieldPattern);
    renderField(field);
    let unit = new Unit(field, [3,2]);
     
    unit.enableKeys(field);

}
