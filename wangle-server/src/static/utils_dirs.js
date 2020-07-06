function $$$set_profile_name_from_this_dir(){
	$$$set_profile_name($$$d[$$$dir_id][0]);
}
function $$$display_child_dirs(_dir_id){
	$$$dir_name = $$$d[_dir_id][0];
	const arr = Object.entries(d).filter(([k,v]) => (k != _dir_id) && (v[0].startsWith($$$dir_name))).map(([k,v]) => "<a onclick='$$$view_dir(" + k + ",0)'>" + v[0] + "</a>");
	$$$document_getElementById('children').innerHTML = arr.join("<br/>");
}
function $$$display_parent_dirs(_dir_id){
	$$$dir_name = $$$d[_dir_id][0];
	const dir_name2id = Object.keys($$$d).reduce(function(obj, key){
		obj[$$$d[key][0]] = key;
		return obj;
	}, {});
	var pth = "";
	const arr = $$$dir_name.split("/").map(x => pth+=x+"/").map(x => dir_name2id[x])
		.filter(x => x) // Removes undefined elements
		.map(x => "<a onclick='$$$view_dir(" + x + ",0)'>" + $$$d[x][0] + "</a>")
	;
	arr.pop(); // Remove last element, which is the current directory
	$$$document_getElementById('parents').innerHTML = arr.join("<br/>");
}

function $$$populate_d_id2name_table(selector, arr){
	let s = "";
	for (const [id, ls] of Object.entries($$$d)){
		if ((arr !== undefined)  &&  (!arr.includes(id)))
			continue;
		s += `
				<div class='tr'>
				<div class='td'>
				<a onclick='$$$view_dir(
			` + id + ",0)'>" + ls[0] + "</a></div><div class='td'><a onclick='$$$view_device(" + ls[1] + ")'>Device</a></div></div>"
		;
	}
	document.querySelector(selector).innerHTML = s;
}


function $$$view_dir(_dir_id_or_path, is_not_in_db, page){
	if(_dir_id_or_path==="")
		_dir_id_or_path=$$$dir_id;
	if(page===undefined)
		page = 0;
	let ls = ['f','f-action-btns','parents-container','children-container','tagselect-files-container','tagselect-files-btn'];
	if(!is_not_in_db){
		ls.push('merge-files-btn');
		ls.push('backup-files-btn');
		ls.push('view-as-playlist-btn');
	}
	$$$hide_all_except(ls);
	
	$$$file_tagger_fn = $$$after_tagged_selected_files;
	$$$get_file_ids = $$$get_selected_file_ids;

	if (_dir_id_or_path !== undefined){
		if(is_not_in_db){
			const dir = Object.entries(d).filter(x => (x[1][0]===_dir_id_or_path))[0];
			if(dir===undefined){
				$$$alert("Directory does not exist in the database");
				$$$dir_id = "0";
			}else{
				$$$dir_id = dir[0];
			}
			$$$populate_f_table(':', null, _dir_id_or_path,page);
		}else{
			$$$dir_id = _dir_id_or_path;
			$$$ajax_GET_w_JSON_response("/a/d/i/"+$$$dir_id, function(data){
				var s = "";
				$('#dir_name').text(data[0]);
			});
			$$$populate_f_table('d', $$$dir_id, null, page);
		}
	}
	
	$$$display_parent_dirs($$$dir_id);
	$$$display_child_dirs($$$dir_id);
	
	if(is_not_in_db){
		$$$set_profile_name(_dir_id_or_path);
	}else{
		$$$set_profile_name_from_this_dir();
	}
}
function $$$view_dirs(ls){
	$$$hide_all_except(['d']);
	$$$populate_d_id2name_table('#d .tbody', ls);
	$$$unset_window_location_hash();
	$$$set_profile_name("All Directories");
}
