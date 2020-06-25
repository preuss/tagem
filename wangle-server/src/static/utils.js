#include "utils_global_vars.js"
#include "utils_core.js"
#include "utils_select2.js"
#include "humanise.js"
#include "utils_tags.js"
#include "utils_dirs.js"
#include "utils_files.js"
#include "utils_tbls.js"
#include "utils_external_dbs.js"
#include "utils_tasks.js"
#include "utils__add_to_db.js"
#include "utils_add_tags.js"
#include "utils_add_file.js"
#include "utils_add_dirs.js"
#include "utils_add_devices.js"
#include "utils_update_orig_src.js"
#include "utils_cookies.js"
#include "text-editor.js"
#include "qry.js"

"function sleep(ms){"
	"return new Promise(resolve => setTimeout(resolve, ms));"
"}"

"function init_selects(var_name){"
	"let s = \"\";"
	"const col = tbl2namecol[var_name];"
	"for (const [id, tpl] of Object.entries(window[var_name])){"
		"s += \"<option value='\" + id + \"'>\" + ((col===null)?tpl:tpl[col]) + \"</option>\";"
	"}"
	"$(tbl2selector[var_name]).html(s).select2();" // Initialise
"}"

"function refetch_json(var_name, url, fn){"
	"get_json(url + '?' + (new Date().getTime()), function(data){"
		// Cache buster url parameter
		"console.log(\"Cache busting\", var_name);"
		"window[var_name] = data;"
		"if(fn !== undefined)"
			"fn();"
		"init_selects(var_name);"
	"});"
"}"
