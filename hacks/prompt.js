// Improve the default prompt with hostname, process type, and version
// prompt = function() {
//     var serverstatus = db.serverStatus();
//     var host = serverstatus.host.split('.')[0];
//     var process = serverstatus.process;
//     var version = db.serverBuildInfo().version;
//     var repl_set = db._adminCommand({"replSetGetStatus": 1}).ok !== 0;
//     var rs_state = '';
//     if(repl_set) {
//         var status = rs.status();
//         var members = status.members;
//         var rs_name = status.set;
//         for(var i = 0; i<members.length; i++){
//             if(members[i].self === true){
//                 rs_state = '[' + members[i].stateStr + ':' + rs_name + ']';
//             }
//         };
//     }
//     var state = isMongos() ? '[mongos]' : rs_state;
//     return host + '(' + process + '-' + version + ')' + state + ' ' + db + '> ';
// };

var prompt = function() {
  var host = "@";
  var status = db.serverStatus();
  if (!!status){
    host += colorize(status.host.split('.')[0], mongo_hacker_config.colors.host);
    host += ".";
  }
  var username = "anon";
  var connectSt = db.runCommand({connectionStatus : 1});
  if (!!connectSt){
    var user = connectSt.authInfo.authenticatedUsers[0];
    if (!!user){
      username = user.user;
    }
  }
  username = colorize(username, mongo_hacker_config.colors.username);
  var current_db = colorize(db.getName(), mongo_hacker_config.colors.db);

  var promt_string = username + host + current_db;
  if(!!status){
    db.setProfilingLevel(2);
  }
  var obj = db.getLastErrorObj();
  if (obj.err) {
    promt_string =  colorize("Error: " + obj.err, mongo_hacker_config.colors.errors);
  }
  print(promt_string);
  return "> ";
};
