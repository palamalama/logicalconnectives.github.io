var LINKS = [];
var LINK_ID = 0;
var SVG = d3.select("svg");

//End of Event handling section

function CreateClause(clause){
	CLAUSES.push(clause);
	CreateTextArea(clause);
	
}

function CreateTextArea(clause){
	
	let group = SVG
		.append("g")
		.attr("ID",clause.id)
		.on("mouseover",function(){Clause_MouseOver(this)})
		.on("mouseout",function(){Clause_MouseOut(this)})
		.on("click",function(){Clause_Click(this)});
		
	SetGroupLocation(group,clause.pos.x,clause.pos.y);
	let foreignObject = group.append("foreignObject");
		
	foreignObject.attr("width",205)//fix this boy
		.attr("height",100)//fix this boy too
		.attr("id",clause.id);
		
	foreignObject.append("xhtml:div")
		.attr("xmlns","http://www.w3.org/1999/xhtml")
		.append("xhtml:textarea")
		.text(clause.text)
		.style("height", "100")//also fix this boy pls
		.style("width", "200px")//this one too
		.style("resize", "none")//maybe as well
		.style("background-color",clause.active ? "white" : "grey");
	
	DRAG_HANDLER(group);
}

function Create_Link(type,sources,destinations){
	var link = {"id":LINK_ID++,"sources":sources,"destinations":destinations,"path":Link_Path(type,sources,destinations)};
	sources.forEach(function(source_id) {
		CLAUSES[source_id].links.push(link.id);
	});
	destinations.forEach(function(destination_id) {
		CLAUSES[destination_id].links.push(link.id);
	});
	LINKS.push(link);
	var new_link = SVG
		.append("path")
		.attr("d",link.path)
		.style("fill","none")
		.style("stroke","black")
		.style("stroke-width","3"); 
		
}

function Update_Link_Path(link){
	link.path = Link_Path(link.type,link.sources,link.destinations);
	return link;
}
function Link_Path(type,sources,destinations){
	var sp = CLAUSES[sources[0]].pos;
	var dp = CLAUSES[destinations[0]].pos;
	var new_d = [{"x": sp.x+205,"y": sp.y+20},
		{"x":dp.x+100,"y":sp.y+20},
		{"x":dp.x+100,"y":dp.y}];
	var line_function = d3.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });
	return line_function(new_d);
}
var ClickedClause;
function ShowClauseOptions(clause){
	if(ClickedClause){
		if(ClickedClause != clause){
			ClickedClause.attr("ShowOptions","false");
		}
	}
	ClickedClause = clause;
	let d = CLAUSES[parseInt(clause.attr("ID"))];
	SVG.selectAll(".options")
		.remove();
	SVG.append("g")
		.attr("class","options")
		.attr("transform",() => {return GroupLocation(d.pos.x,d.pos.y)})
		.append("rect")
		.attr("width",30)
		.attr("height",30)
		.on("mouseover",() => {})
		.on("mouseout",() => {})
		.on("click",() => AddLinkButtonPressed(clause))
		.style("fill","green");

}
function HideClauseOptions(clause){
	SVG.selectAll(".options")
		.remove();
}
function SetGroupLocation(group,x,y){
	group.attr("transform","translate("+x+","+y+")");
}

function GroupLocation(x,y){
	return "translate("+x+","+y+")";
}

function GetGroupLocation(group){
	let transform = group.attr("transform");
	if(!transform) return [0,0];
	let start = transform.indexOf("translate");
	let end = transform.substring(start).indexOf(")");
	transform = transform.substring(start,end+1);
	let x = transform.substring(transform.indexOf("(")+1,transform.indexOf(","));
	let y = transform.substring(transform.indexOf(",")+1,transform.indexOf(")"));
	return [parseInt(x),parseInt(y)];
	
}
