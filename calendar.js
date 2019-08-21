let table_row_1=true;
let pixels_per_minute = 2;
let start_hour = 7;
let hour_count = 16;
function get_calendar(){
    console.log(cal)
    //add time labels
    for(var i=0;i<14;i++){
      $("#time_header").append($('<div class="time_label" style="left:'+(120*i)+'px">'+((i+6)%12+1)+':00</div>')) 
    }

    //add room
    let room_list=[];
    for(var i=0;i<cal.rooms.length;i++){
        //TNRB_110_20203
       if (room_list.indexOf(cal.rooms[i].id.split("_")[0]+cal.rooms[i].id.split("_")[1])==-1){
         add_room(cal.rooms[i].id.split("_")[0],cal.rooms[i].id.split("_")[1]);
         room_list.push(cal.rooms[i].id.split("_")[0]+cal.rooms[i].id.split("_")[1])
       }
       
    }

    //add section
    //add_section("TNRB", "210", "T","IS","250","1","1970-01-04T18:00","1970-01-04T23:00");
    for(var i=0;i<cal.events.length;i++){
        let building = cal.events[i].resourceId.split("_")[0];
        let room = cal.events[i].resourceId.split("_")[1];
        let days = cal.events[i].data.dayStringPrefix.split(" / ");
        let pos =  cal.events[i].data.courseCode.lastIndexOf(" ");
        let dept = cal.events[i].data.courseCode.substr(0,pos);
        let class_no = cal.events[i].data.courseCode.substr(pos+1);
        let section_no=parseInt(cal.events[i].data.sectionNumber);
        let start_time = cal.events[i].start;
        let end_time = cal.events[i].end;

        console.log("building",building,"room",room,"days",days,"pos",pos,"dept",dept,"class_no",class_no,"section_no",section_no,"start_time",start_time,"end_time",end_time)
        for (var j=0;j<days.length;j++){
            add_section(building,room,days[j],dept,class_no,section_no,start_time,end_time);
        }
        
        
    }
    
  }


  function add_section(building,room, day, dept,class_no, section_no,start_time,end_time){
    let start = time_to_pixels(start_time)  ;
    let duration = time_to_pixels(end_time)  - start - 12;
    let section_template = '<div class="_DEPTID_ section tooltip" style="width:_DURATION_px; left:_START_px;">_DEPT_ _CLASS_NO_-_SECTION_NO_<span class="tooltiptext">Tooltip text is</span></div>'  
    section_template=section_template.replace(/_BUILDING_/g, building );
    section_template=section_template.replace(/_ROOM_/g, room );
    section_template=section_template.replace(/_DAY_/g, day );
    section_template=section_template.replace(/_DEPT_/g, dept );
    section_template=section_template.replace(/_DEPTID_/g, dept.replace(/ /g,'_') );
    section_template=section_template.replace(/_CLASS_NO_/g, class_no );
    section_template=section_template.replace(/_SECTION_NO_/g, section_no );
    section_template=section_template.replace(/_START_/g, start );
    section_template=section_template.replace(/_DURATION_/g, duration );
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
    let room_template=`        <tr>
        <td class="room" rowspan="5">_BUILDING_ _ROOM_</td>  
        <td class="day">M</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__M">&nbsp;
        <div> 
      </td>
    </tr>

    <tr>
        <td class="day">W</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__W">&nbsp;
        <div> 
      </td>
    </tr>

    <tr>
        <td class="day">F</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__F">&nbsp;
        <div> 
      </td>
    </tr>

    <tr>
        <td class="day">T</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__T">&nbsp;
        <div> 
      </td>
    </tr>

    <tr>
        <td class="day">Th</td>  
        <td class="cal">
        <div class="day" id="_BUILDING___ROOM__R">&nbsp;
        <div> 
      </td>
    </tr>
`
    
    room_template=room_template.replace(/_BUILDING_/g, building );
    room_template=room_template.replace(/_ROOM_/g, room );
    if(table_row_1)room_template=room_template.replace(/class="cal"/g, 'class="cal2"' );
    table_row_1=!table_row_1;
    //console.log(room_template);
    $("#calendar").append($(room_template));
    add_section(building, room, "T","Devotional","","","1970-01-04T11:00","1970-01-04T12:00");
  }

