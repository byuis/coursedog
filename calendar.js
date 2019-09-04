let table_row_1=true;
let pixels_per_minute = 2;
let start_hour = 7;
let hour_count = 16;
let room_list=[];
let dept_list=[];
let dept_excl=[];


function junk(){
 hide_empty_rooms();
}

function choose_departments(){
  multi_select()
}

function show_departments(){ // display visible departments
  console.log("dept_list",dept_filter)
  var sList="";
  for(var i=0;i<dept_list.length;i++){
    if(dept_excl.indexOf(dept_list[i])==-1){
      sList += '<div class="dept '+dept_list[i].replace(/ /g,"_")+'" > ' + dept_list[i] + "</div>"  ;
    }
  }
  $("#dept_filter").html(sList);
  build_calendar()
}

function multi_select_ok(){
  console.log("at multi_select_ok")
  dept_excl = [];
  let sList = "";
  $('#multi_select input').each(function () {
    if(!$(this).is(':checked')){dept_excl.push($(this).val())}
  });
  show_departments();
  $("#multi_select").remove();
}

function multi_select_cancel(){
  console.log("at multi_select_cancel")
  $("#multi_select").remove();
}

function multi_select(){
  let dialog =  '<div class="dialog" id="multi_select">'
  for (let i=0;i<dept_list.length;i++){
    if(dept_excl.indexOf(dept_list[i])==-1){
      dialog+='<input type="checkbox" checked value="'+dept_list[i]+'"><div class="'+dept_list[i].replace(/ /g,"_")+' dept">'+dept_list[i]+'</div><br>'
    }else{
      dialog+='<input type="checkbox" value="'+dept_list[i]+'"><div class="'+dept_list[i].replace(/ /g,"_")+' dept">'+dept_list[i]+'</div><br>'
    }
  } 
  dialog +=`
    <div style="float:right">
      <button onclick="multi_select_ok()">OK</button>
      <button onclick="multi_select_cancel()">Cancel</button>
    </div>
  </div>  
  `;
  $(document.body).append($(dialog));
  $("#multi_select").css($("#dept_filter").offset());
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
  if($("#hide_empty").is(":checked")){
    hide_empty_rooms();
  }else{
    show_all_rooms()
  }
}


function hide_empty_rooms(){
  console.log ("dept_excl",dept_excl)
  var empty_count = Math.abs(dept_excl.indexOf("Devotional") )
  if ($("#rooms").val()) {empty_count=0}; //if the user has specified a room, then ignore devotional
  console.log ("empty_count",empty_count)
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


function main(){
  init_body()
  get_calendar()
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
  console.log("year",year)
  console.log("term",term)
  console.log("term_code",term_code)

  $.getScript( "https://script.google.com/macros/s/AKfycbxT7gYT5yO1xAIeUmXBIVlCmVe4QI2213XvyuG0wpSgcaCD7_L6/exec?year=" + year + "&semester=" + term + "&departments=1517", function( data, textStatus, jqxhr ) {
    dept_list=[];
    build_calendar();
    show_departments();
  });
}
function apply_filters(){

  build_calendar();


}


function init_body(){
  $("body").html(`
  <table align="center" border="1" cellpadding="4" style="border-collapse:collapse">
    <tr>  
      <th>
        Term
      </th>
      <td>
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
        <input type="checkbox" id="hide_empty" onclick="process_room_filter()"> Hide Empty Rooms
      </td>
    </tr>


    <tr>  
      <th>
        Departments
      </th>
      <td>
        <div id="dept_filter" onclick="choose_departments()">All</div>
      </td>
    </tr>
    <tr>  
        <th>
        Courses
      </th>
      <td>
        <textarea rows="5" cols="80" id="rooms" onchange="build_calendar()" placeholder="Comma separated list of courses (e.g. IS 201, M COM 320)"></textarea>
      </td>
    </tr>


    </table>

  <br/>
  <div id="time_header"></div>  
  <div id="calendar_div">
  
  </div>
`);  
}

function build_calendar(){

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
        let pos =  cal.events[i].data.courseCode.lastIndexOf(" ");
        let dept = cal.events[i].data.courseCode.substr(0,pos);
        let class_no = cal.events[i].data.courseCode.substr(pos+1);
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


  function add_section(building,room, day, dept,class_no, course_name,professors, section_no,start_time,end_time){
    if(dept_excl.indexOf(dept)>-1){return;}
    if($("#rooms").val()){
      if($("#rooms").val().toUpperCase().indexOf(dept + " " + class_no)==-1){return;}
    }
    let start = time_to_pixels(start_time)  ;
    let duration = time_to_pixels(end_time)  - start - 12;
    let section_template = '<div class="_DEPTID_ section tooltip" style="width:_DURATION_px; left:_START_px;">_DEPT_ _CLASS_NO_-_SECTION_NO_<span class="tooltiptext" >_COURSENAME_<hr>_PROFESSORS_</span></div>'  
    if(dept_list.indexOf(dept)==-1){
      dept_list.push(dept);
    }  
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

