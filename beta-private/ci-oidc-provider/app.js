var _0x398e=['getConfig','loadUsers','idp_name','findById','bind','generate','RSA','initialize','client_config','app','proxy','injectLogger','use','set','x-warning','Not\x20for\x20Production\x20Use!','trust\x20proxy','view\x20engine','ejs','views','resolve','router','listen','port','then','info','Ready!','catch','oidc-provider','path','express','@qlik/node-microservice-logger','./server/accountStore','./server/users','./server/health','soidc'];(function(_0x582f20,_0xa489ae){var _0x534348=function(_0x782521){while(--_0x782521){_0x582f20['push'](_0x582f20['shift']());}};_0x534348(++_0xa489ae);}(_0x398e,0x64));var _0x7c28=function(_0x19459a,_0x46c256){_0x19459a=_0x19459a-0x0;var _0x202018=_0x398e[_0x19459a];return _0x202018;};const Provider=require(_0x7c28('0x0'));const path=require(_0x7c28('0x1'));const express=require(_0x7c28('0x2'));const cors=require('cors');const Logger=require(_0x7c28('0x3'));const AccountStore=require(_0x7c28('0x4'));const configFuncs=require('./server/config');const usersFuncs=require(_0x7c28('0x5'));const interactions=require('./server/interactions');const health=require(_0x7c28('0x6'));const logger=new Logger(_0x7c28('0x7'));async function start(){const _0x5187cb=configFuncs[_0x7c28('0x8')]();const _0x28c572=new AccountStore(usersFuncs[_0x7c28('0x9')]());const _0x164bd6=new Provider(_0x5187cb[_0x7c28('0xa')],{'findById':_0x28c572[_0x7c28('0xb')][_0x7c28('0xc')](_0x28c572),'claims':_0x5187cb['claim_mapping'],'features':{'claimsParameter':!![],'discovery':!![],'encryption':!![],'introspection':!![],'registration':!![],'request':!![],'revocation':!![],'sessionManagement':!![],'clientCredentials':!![]}});const _0x320563=Provider['createKeyStore']();await _0x320563[_0x7c28('0xd')](_0x7c28('0xe'),0x800);await _0x164bd6[_0x7c28('0xf')]({'keystore':_0x320563,'clients':_0x5187cb[_0x7c28('0x10')]});_0x164bd6[_0x7c28('0x11')][_0x7c28('0x12')]=!![];const _0x58b481=express();Logger[_0x7c28('0x13')](_0x58b481);_0x58b481[_0x7c28('0x14')]((_0x1078c1,_0x191ca2,_0x4a8df7)=>{_0x191ca2[_0x7c28('0x15')](_0x7c28('0x16'),_0x7c28('0x17'));_0x4a8df7();});_0x58b481[_0x7c28('0x15')](_0x7c28('0x18'),!![]);_0x58b481['set'](_0x7c28('0x19'),_0x7c28('0x1a'));_0x58b481[_0x7c28('0x15')](_0x7c28('0x1b'),path[_0x7c28('0x1c')](__dirname,_0x7c28('0x1b')));_0x58b481['use'](cors());_0x58b481[_0x7c28('0x14')](health());_0x58b481[_0x7c28('0x14')](interactions(_0x164bd6,_0x28c572)[_0x7c28('0x1d')]);_0x58b481['use'](_0x164bd6['callback']);_0x58b481[_0x7c28('0x1e')](_0x5187cb[_0x7c28('0x1f')]);}start()[_0x7c28('0x20')](()=>{logger[_0x7c28('0x21')](_0x7c28('0x22'));})[_0x7c28('0x23')](_0x35edb4=>{logger[_0x7c28('0x21')]('Failed\x20to\x20start');logger[_0x7c28('0x21')](_0x35edb4);});
//# sourceMappingURL=app.js.map