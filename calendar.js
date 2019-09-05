let table_row_1=true;
let pixels_per_minute = 2;
let start_hour = 7;
let hour_count = 16;
let room_list=[];

let dept_list=[];
let inst_list=[];
let course_list=[];

let dept_chosen=[];
let inst_chosen=[];
let course_chosen=[];


function get_dept(text){  //if text starts out like one of our departments, return the department it mathces, otherwise null string
  for(var i=0;i<dept_list.length;i++){
    if (dept_list[i]+" "==(text + ' ').substr(0,dept_list[i].length+1)){
      //the text starts out just like a department
      return dept_list[i];
    }
  }
  return "";
}



function picker_pill_click(caller, div_id, chosen){
  place_pill(caller.innerHTML,div_id)
  chosen.push(caller.innerHTML)
  $("#"+caller.id).remove();
}

function place_pill(text,div_id){
  let pill='<div id="a'+Math.random().toString().substring(2)+'" onclick="kill_pill(this, ' + div_id + '_chosen)" class="'+get_dept(text).replace(/ /g,"_")+' pill" >' + text + '</div>';
  $("#"+div_id).append(pill);
}

function kill_pill(caller, chosen){
  chosen.splice(chosen.indexOf(caller.innerHTML),1) ;
  $("#"+caller.id).remove();
  build_calendar();
}

function picker_close(id){
  $("#"+id).remove();
  build_calendar();
}
function picker_show(div_id,list,chosen){
  //if($('#'+div_id+"_picker").length)$("#"+div_id+"_picker").remove(); 
  $(".dialog").remove(); //close any open dialogs


  let dialog =  '<div style="width:200" class="dialog" id="' + div_id + '_picker">'
  for (let i=0;i<list.length;i++){
    if(chosen.indexOf(list[i])==-1){
      dialog+='<div id="a'+Math.random().toString().substring(2)+'" onclick="picker_pill_click(this, \''+div_id+'\','+div_id+'_chosen)" class="'+get_dept(list[i]).replace(/ /g,"_")+' pill">'+list[i]+'</div>'
    }
  } 
  console.log("after loop")
  dialog +='<div style="float:right"><br/><button onclick="picker_close(\'' + div_id + '_picker\')">Close</button></div></div>'; 
 
  $(document.body).append($(dialog));
  let offset = $("#" + div_id).offset();
  let h=$("#" + div_id).height();
  console.log("h",h)
  if(h==0)h=15;
  $("#" + div_id + "_picker").css({top:offset.top+h,left:offset.left});

}

function show_room(building, room, show){
  if(show){
    $("#ROW_"+building+"_"+room+"_M").show();
    $("#ROW_"+building+"_"+room+"_T").show();
    $("#ROW_"+building+"_"+room+"_W").show();
    $("#ROW_"+building+"_"+room+"_R").show();
    $("#ROW_"+building+"_"+room+"_F").show();
  }else{
    $("#ROW_"+building+"_"+room+"_M").hide();
    $("#ROW_"+building+"_"+room+"_T").hide();
    $("#ROW_"+building+"_"+room+"_W").hide();
    $("#ROW_"+building+"_"+room+"_R").hide();
    $("#ROW_"+building+"_"+room+"_F").hide();
  }
  color_bands()
}

function set_shade(shade,building, room){
  var shade_class;
  if(shade){ shade_class="cal"}else{shade_class="cal2"}
  $("#"+building+"_"+room+"_M").parent().attr('class',shade_class);
  $("#"+building+"_"+room+"_T").parent().attr('class',shade_class);
  $("#"+building+"_"+room+"_W").parent().attr('class',shade_class);
  $("#"+building+"_"+room+"_R").parent().attr('class',shade_class);
  $("#"+building+"_"+room+"_F").parent().attr('class',shade_class);
}

function meeting_count(building, room){
  return $("#"+building+"_"+room+"_M").children().length
       + $("#"+building+"_"+room+"_T").children().length
       + $("#"+building+"_"+room+"_W").children().length
       + $("#"+building+"_"+room+"_R").children().length
       + $("#"+building+"_"+room+"_F").children().length;
      
}

function process_room_filter(){
  update_url();
  if($("#hide_empty").is(":checked")){
    hide_empty_rooms();
  }else{
    show_all_rooms()
  }
}


function hide_empty_rooms(){
  var empty_count = 1;
  if (dept_chosen.length + course_chosen.length + inst_chosen.length > 0) {empty_count=0}; //if the user has specified a course,dept,or instructor then ignore devotional
  for (var i=0;i<room_list.length;i++){
    if(meeting_count(room_list[i].split("_")[0],room_list[i].split("_")[1])==empty_count){
      show_room(room_list[i].split("_")[0],room_list[i].split("_")[1], false);
    }
  }
}

function show_all_rooms(){
  for (var i=0;i<room_list.length;i++){
    if($("#"+room_list[i]+"_M").is(":hidden")){
      show_room(room_list[i].split("_")[0],room_list[i].split("_")[1], true);
    }
  }
}


function color_bands(){
  let shade = true
  for (var i=0;i<room_list.length;i++){
    if($("#"+room_list[i]+"_M").is(":visible")){
      set_shade(shade,room_list[i].split("_")[0],room_list[i].split("_")[1]);
      shade=!shade;
    }
  }
}

function place_params(param,div){
  let chosen=[];
  let p = get_parameter(param)
  if(p!="null"){
     chosen = p.split("|")
    for(var i=0;i<chosen.length;i++){
      place_pill(chosen[i],div)
    }
  }
  return chosen;
}

function main(){
  init_body()
  $("#hide_empty").prop('checked', get_parameter("h")); //.val(get_parameter("h"))
  
  let t=get_parameter("t");
  console.log("t",t)
  if(t!="null"){
    console.log(1)
    $("#term").val(t)
  }
  
/*
  // read params
  $("#instructors").html(get_parameter("i"))
  $("#courses").html(get_parameter("c"))
  $("#hide_empty").prop('checked', get_parameter("h")=='hide'); //.val(get_parameter("h"))

  */
  get_calendar()
}

function get_parameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return decodeURIComponent(result);
}

function get_calendar(){
  var term_code=$("#term").val();
  var term = term_code.slice(-1);
  var year;
  if(term==5) {//fall
    year=term_code.substr(0,4);
    year = year +'-'+ (parseInt(year)+1).toString().slice(-2)
  }else{//winter spring summer
    year=term_code.substr(0,4);
    year = (parseInt(year)-1) +'-'+ year.toString().slice(-2)
  }
  $.getScript( "https://script.google.com/macros/s/AKfycbxT7gYT5yO1xAIeUmXBIVlCmVe4QI2213XvyuG0wpSgcaCD7_L6/exec?year=" + year + "&semester=" + term + "&departments=1517", function( data, textStatus, jqxhr ) {
    build_lists();
    inst_chosen = place_params("i","inst")
    dept_chosen = place_params("d","dept")
    course_chosen = place_params("c","course")
    console.log("inst_chosen",inst_chosen)
    console.log("dept_chosen",dept_chosen)
    console.log("course_chosen",course_chosen)
    build_calendar();
  });
}
function apply_filters(){

  build_calendar();


}
function build_lists(){
  for(var i=0;i<cal.events.length;i++){
    add_to_list(course_list,cal.events[i].data.courseCode);
    add_to_list(dept_list,get_dept_from_course(cal.events[i].data.courseCode));
    add_to_list(inst_list,cal.events[i].data.professors,", ");
  }
  course_list.sort();
  dept_list.sort();
  inst_list.sort();

  console.log("course_list",course_list);
  console.log("dept_list",dept_list);
  console.log("inst_list",inst_list);
}


function add_to_list(the_array, the_value, value_delimeter){
  if(the_value==""){return;}
  if (value_delimeter==null){
    add_one_to_list(the_value);
  }else{
    let values=the_value.split(value_delimeter);
    for(var j=0;j<values.length;j++){
      add_one_to_list(values[j]);
    }
  }
  function add_one_to_list(value){
    if(the_array.indexOf(value)==-1){
      the_array.push(value)
    }
  }
}

function get_array_param(chosen){
  let temp="";
  for(let i=0; i<chosen.length;i++){
    temp+="|"+encodeURI(chosen[i])
  }
  return temp.substring(1);
}

function update_url(){
  //updates the URL with the current filters so it can be copied
  let url=document.location.href.split("?")[0];
  url+="?h=" + $("#hide_empty").is(":checked")
  if(dept_chosen.length>0)url+="&d=" + get_array_param(dept_chosen);
  if(course_chosen.length>0)url+="&c=" + get_array_param(course_chosen);
  if(inst_chosen.length>0)url+="&i=" + get_array_param(inst_chosen);
  url+="&t=" + $("#term").val();
  history.pushState(null, "Term Schedule", url);
}

function build_calendar(){
  // update the url to include the current configuration
  update_url();

  $("#calendar_div").html('<table class="cal" id="calendar"></table>');

    console.log(cal)
    //console.log($("#term").val())
    //add time labels
    for(var i=0;i<14;i++){
      $("#time_header").append($('<div class="time_label" style="left:'+(120*i)+'px">'+((i+6)%12+1)+':00</div>')) 
    }

    //add room
    
    for(var i=0;i<cal.rooms.length;i++){
        //TNRB_110_20203
       //if (room_list.indexOf(cal.rooms[i].id.split("_")[0]+"_"+cal.rooms[i].id.split("_")[1])==-1){
       //console.log(i , cal.rooms[i].id.split("_")[2],$("#term").val())  
       if (cal.rooms[i].id.split("_")[2]==$("#term").val()){
         console.log("match")
         add_room(cal.rooms[i].id.split("_")[0],cal.rooms[i].id.split("_")[1]);
         room_list.push(cal.rooms[i].id.split("_")[0]+"_"+cal.rooms[i].id.split("_")[1])
       }
       
    }
    color_bands();
    //add section
    //add_section("TNRB", "210", "T","IS","250","1","1970-01-04T18:00","1970-01-04T23:00");
    for(var i=0;i<cal.events.length;i++){
        let building = cal.events[i].resourceId.split("_")[0];
        let room = cal.events[i].resourceId.split("_")[1];
        let term = cal.events[i].resourceId.split("_")[2];
        let days = cal.events[i].data.dayStringPrefix.split(" / ");
        let dept = get_dept_from_course(cal.events[i].data.courseCode);
        let class_no = get_number_from_course(cal.events[i].data.courseCode);
        let course_name = cal.events[i].data.courseName.split(" (")[0];
        let professors = cal.events[i].data.professors;
        let section_no=parseInt(cal.events[i].data.sectionNumber);
        let start_time = cal.events[i].start;
        let end_time = cal.events[i].end;
        console.log("term: ",term)
        //console.log("building",building,"room",room,"days",days,"pos",pos,"dept",dept,"class_no",class_no,"section_no",section_no,"start_time",start_time,"end_time",end_time)
        for (var j=0;j<days.length;j++){
          if(term==$("#term").val()){
            add_section(building,room,days[j],dept,class_no,course_name,professors,section_no,start_time,end_time);
          }  
        }
        
        
    }
    process_room_filter();
    
  }
  function get_dept_from_course(course){
    return course.substr(0,course.lastIndexOf(" "));
  }

  function get_number_from_course(course){
    return course.substr(course.lastIndexOf(" ")+1);
  }

  function add_section(building,room, day, dept,class_no, course_name,professors, section_no,start_time,end_time){
    if(dept_chosen.length>0) if(dept_chosen.indexOf(dept)==-1)return;
    if(course_chosen.length>0) if(course_chosen.indexOf(dept + " " + class_no)==-1)return;
    
    if(inst_chosen.length>0){
      let intersection = inst_chosen.filter(x => professors.split(", ").includes(x));
      if(intersection.length ==0){return;} 
    } 

    
    if($("#rooms").val()){
      if($("#rooms").val().toUpperCase().indexOf(dept + " " + class_no)==-1){return;}
    }
    if($("#instructors").val()){
      if(professors == ""){return;}
      if($("#instructors").val().toUpperCase().indexOf(professors.toUpperCase())==-1){return;}
    }

    let start = time_to_pixels(start_time)  ;
    let duration = time_to_pixels(end_time)  - start - 12;
    let section_template = '<div class="_DEPTID_ section tooltip" style="width:_DURATION_px; left:_START_px;">_DEPT_ _CLASS_NO_-_SECTION_NO_<span class="tooltiptext" >_COURSENAME_<hr>_PROFESSORS_</span></div>'  
    section_template=section_template.replace(/_BUILDING_/g, building );
    section_template=section_template.replace(/_ROOM_/g, room );
    section_template=section_template.replace(/_DAY_/g, day );
    section_template=section_template.replace(/_DEPT_/g, dept );
    section_template=section_template.replace(/_DEPTID_/g, dept.replace(/ /g,'_') );
    section_template=section_template.replace(/_CLASS_NO_/g, class_no );
    section_template=section_template.replace(/_SECTION_NO_/g, section_no );
    section_template=section_template.replace(/_START_/g, start );
    section_template=section_template.replace(/_DURATION_/g, duration );
    section_template=section_template.replace(/_COURSENAME_/g, course_name );
    section_template=section_template.replace(/_PROFESSORS_/g, professors );
    //section_template=section_template.replace(/__/g,  );
    
    
    $("#" + building + "_" + room + "_" + day).append($(section_template));
  }

  function time_to_pixels(the_time){//takes a date and time and returns the corresponding number of pixels
    // 1970-01-04T18:00
    let minutes = parseInt(the_time.split("T")[1].split(":")[0]*60); 
    minutes += parseInt(the_time.split("T")[1].split(":")[1]); 
    return (minutes-start_hour*60) * pixels_per_minute; 
 }

  
  function add_room(building,room){
    let room_template=`        <tr id="ROW__BUILDING___ROOM__M">
        <td class="room" rowspan="5"><span class="spoiler"><a target="_blank" href="https://y.byu.edu/ry/ae/prod/class_schedule/cgi/classRoom2.cgi?year_term=20195&room=_ROOM_&building=_BUILDING_&tab_option=i">_BUILDING_ _ROOM_</a><br><span class="link" onclick="show_room('_BUILDING_','_ROOM_',false)">hide</span></span></td>  
        <td class="day">M</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__M">&nbsp;
        </div> 
      </td>
    </tr>

    <tr id="ROW__BUILDING___ROOM__W">
        <td class="day">W</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__W">&nbsp;
        </div> 
      </td>
    </tr>

    <tr id="ROW__BUILDING___ROOM__F">
        <td class="day">F</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__F">&nbsp;
        </div> 
      </td>
    </tr>

    <tr id="ROW__BUILDING___ROOM__T">
        <td class="day">T</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__T">&nbsp;
        </div> 
      </td>
    </tr>

    <tr id="ROW__BUILDING___ROOM__R">
        <td class="day">Th</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__R">&nbsp;
        </div> 
      </td>
    </tr>
`
    
    room_template=room_template.replace(/_BUILDING_/g, building );
    room_template=room_template.replace(/_ROOM_/g, room );
    //if(table_row_1)room_template=room_template.replace(/class="cal"/g, 'class="cal2"' );
    //table_row_1=!table_row_1;
    //console.log(room_template);
    $("#calendar").append($(room_template));
    add_section(building, room, "T","Devotional","","University Devotional","","","1970-01-04T11:00","1970-01-04T12:00");
  }

  function init_body(){
    $("body").html(`
    <table  align="center" border="1" cellpadding="4" style="border-collapse:collapse;width:800">
      <tr>  
        <th>
          Term
        </th>
        <td width="100%">
          <select id="term" onchange="get_calendar()">
            <option value="20203">Spring 2020</option>option>
            <option value="20204">Summer 2020</option>option>
          </select>
        </td>
      </tr>
  
      <tr>  
        <th>
          Rooms
        </th>
        <td>
          <input type="checkbox" id="hide_empty" onchange="process_room_filter()"> Hide Empty Rooms
        </td>
      </tr>
  
  
      <tr>  
        <th onclick="picker_show('dept', dept_list, dept_chosen)">
          <u>Departments</u>
        </th>
        <td bgcolor="#ddd">
          <div id="dept"></div>
        </td>
      </tr>
      <tr>  
        <th onclick="picker_show('course', course_list, course_chosen)">
        <u>Courses</u>
        </th>
        <td bgcolor="#ddd">
          <div id="course"></div>
        </td>
      </tr>
      <tr>  
          <th onclick="picker_show('inst', inst_list, inst_chosen)">
          <u>Instructors</u>
        </th>
        <td bgcolor="#ddd">
          <div id="inst"></div>
        </td>
      </tr>
  
      </table>
  
    <br/>
    <div id="time_header"></div>  
    <div id="calendar_div">
    
    </div>
  `);  
  }
  