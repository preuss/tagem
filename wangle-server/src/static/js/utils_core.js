function $$$hide_all_except(ids,classes){
	// More like 'page switch' event now
	if(!ids.includes('file-info'))
		$$$playlist_file_ids = undefined; // Destroy playlist
	$$$document_getElementById('profile-img').removeAttribute('onclick');
	$$$hide_class('help');
	for(const id of [
		'text-editor',
		'add-f-backup-toggle-container',
		'add-f-backup',
		'f',
		'd',
		't',
		'merge-files-btn',
		'backup-files-btn',
		'view-as-playlist-btn',
		'tasks-container',
		'file-info',
		'next-f-in-playlist',
		'user-info',
		'post-container',
		'file2-container',
		'file2',
		'descr',
		'values-container',
		'tags-container',
		'parents-container',
		'children-container',
		'dirselect-container',
		'deviceselect-container',
		'protocolselect-container',
		'tagselect-files-container',
		'tagselect-files-btn',
		'tagselect-era-container',
		'tagselect-eras-container',
		'tagselect-dirs-container',
		'tagselect-self-p-container',
		'tagselect-self-p-btn',
		'tagselect-self-c-container',
		'tagselect-self-c-btn',
		'add-t-dialog',
		'add-f-dialog',
		'add-d-dialog',
		'add-D-dialog',
		'orig-src-dialog'
	]){
		if(ids.includes(id))
			$$$unhide(id);
		else 
			$$$hide(id);
	}
	for(const c of [
		'file-meta'
	]){
		if((classes===undefined)||(!classes.includes(c)))
			$$$hide_class(c);
		else
			$$$unhide_class(c);
	}
}
function $$$is_visible(id){
	return (!$$$document_getElementById(id).classList.contains('hidden'));
}
function $$$toggle(id){
	$$$document_getElementById(id).classList.toggle("hidden");
}

function $$$set_var_to_json_then(var_name, url, fn){
	// All global variable are set in the window object
	if ($$$window[var_name] !== undefined){
		fn();
		return;
	}
	$$$ajax_GET_w_JSON_response(url, function(data){
		const additions = $$$get_cookie(var_name + '_adds');
		if (additions !== undefined){
			$$$merge_into(data, JSON.parse(additions));
		}
		
		const dels = $$$get_cookie(var_name + '_dels');
		if (dels !== undefined){
			$$$del_keys(data, JSON.parse(dels));
		}
		
		$$$window[var_name] = data;
		
		fn();
	});
}
function $$$link_to_named_fn_w_param_id_w_human_name(fn,id,x){
	return "<a onclick='"+fn+"(\""+id+"\")'>"+((x instanceof Array)?x[0]:x)+"</a> ";
}
function $$$sub_into(data, node, fn_name){
	let s = "";
	if (data instanceof Array)
		data = Object.fromEntries(data.entries()); // Convert ["foo","bar"] -> {0:"foo", 1:"bar"}
	for (var tagid of $$$split_on_commas_but_make_empty_if_empty(node.textContent)){
		s += $$$link_to_named_fn_w_param_id_w_human_name(fn_name,tagid,data[tagid]);
	}
	node.innerHTML = s;
}

function $$$invert_dict(data){
	return Object.fromEntries(Object.entries(data).map(([k, v]) => [v, k]));
}

function $$$zipsplitarr(keys, vals){
	// Convert two arrays into a dictionary
	// [foo, bar], [ree, gee] -> [[foo,ree], [foo,gee], [bar,ree], [bar,gee]]
	const arr = [];
	for (const key of keys){
		for (const val of vals){
			arr.push([key, val]);
		}
	}
	return arr;
}