"function add_files_dialog(){"
	"unhide('tags-container');"
	"hide('parents-container');"
	"hide('children-container');"
	"hide('file-info');"
	"hide('f');"
	"hide('d');"
	"hide('t');"
	"unhide('tagselect-files-container');"
	"hide('tagselect-self-p-container');"
	"hide('tagselect-self-c-container');"
	"unhide('add-files-dialog');"
"}"

"function add_file(){"
	"const urls = Array.from(document.getElementById('add-files-queue').getElementsByTagName('ul')).map(x => x.textContent);"
	"if(urls.length===0)"
		"return;"
	"const tagselect = $('#tagselect-files');"
	"const tag_ids = tagselect.val();"
	"if(tag_ids.length === 0)"
		"return;"
	"const dir = document.getElementById(\"add-file-dir-input\").value;"
	"if(dir === \"\"){"
		"alert(\"Please set the directory - likely a common prefix of all the URLs\");"
		"return;"
	"}"
	"for(const url of urls){"
		"if(!url.startsWith(dir)){"
			"const b = confirm(\"The directory is not a common prefix of all the URLs. Still proceed?\");"
			"if(!b)"
				"return;"
		"}"
	"}"
	"$.ajax({"
		"type:\"POST\","
		"url:\"http://localhost:1999/add-f/\" + tag_ids.join(\",\") + \"/\" + dir,"
		"data:urls.join(\"\\n\"),"
		"success:function(){"
			"tagselect.val(\"\").change();"
			"alert(\"Success\");"
		"},"
		"dataType:\"text\""
	"});"
"}"

"function add_files__append(){"
	"const inp = document.getElementById('add-file-input');"
	"const x = inp.value;"
	"if(x !== \"\")"
		"document.getElementById('add-files-queue').innerHTML += \"<ul>\" + inp.value + \"</ul>\";"
	"inp.value = \"\";"
"}"
