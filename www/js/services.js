angular.module('starter.services', [])

    .factory('Usuarios', function ($http, $q) {
        var url = "https://awnotepad.azure-mobile.net/tables/usuarios";
        $http.defaults.headers.common = {
            'X-ZUMO-APPLICATION': 'dpRuizzhXZcJOEFKRujsFLigRMUTHQ39',
            'Access-Control-Allow-Origin': '*'

        };


        return {
            validarUsuario: function (usuario) {
                var query = "?$filter=email eq '" + usuario.email +
                    "' and password eq '" + usuario.password + "'";
                var request = $http(
                    {
                        url: url + query,
                        method: 'get'

                    });

                return request.then(ok, err);
            }
        }

        function ok(resp) {
            return resp.data;

        }

        function err(resp) {
            if (!angular.isObject(resp.data) || !resp.data.message) {
                return ($q.reject("Error desconocido"));

            }
            return ($q.reject(resp.data.message));
        }

    })


    .factory('Blocs', function ($http, $q) {
        var url = "https://awnotepad.azure-mobile.net/tables/blocs";
        $http.defaults.headers.common = {
            'X-ZUMO-APPLICATION': 'dpRuizzhXZcJOEFKRujsFLigRMUTHQ39',
            'Access-Control-Allow-Origin': '*'

        };
        return {
            getBlocs: function (idUsuario) {
                var query = "?$filter=idUsuario eq '" + idUsuario + "'";
                var request = $http(
                    {
                        url: url + query,
                        method: 'get'

                    });

                return request.then(ok, err);


            }

        }
        function ok(resp) {
            return resp.data;

        }

        function err(resp) {
            if (!angular.isObject(resp.data) || !resp.data.message) {
                return ($q.reject("Error desconocido"));

            }
            return ($q.reject(resp.data.message));
        }
    })
    .factory('Notas', function ($http, $q) {
        var url = "https://awnotepad.azure-mobile.net/tables/notas";
        $http.defaults.headers.common = {
            'X-ZUMO-APPLICATION': 'dpRuizzhXZcJOEFKRujsFLigRMUTHQ39',
            'Access-Control-Allow-Origin': '*'

        };
        return {
            getNotasPorBloc: function (idBloc) {
                var query = "?$filter=idBloc eq '" + idBloc + "'";
                var request = $http(
                    {
                        url: url + query,
                        method: 'get'

                    });

                return request.then(ok, err);


            }

        }
        function ok(resp) {
            return resp.data;

        }

        function err(resp) {
            if (!angular.isObject(resp.data) || !resp.data.message) {
                return ($q.reject("Error desconocido"));

            }
            return ($q.reject(resp.data.message));
        }
    })
    .factory('Conexion', function () {


        return {
            getEstado: function () {

                try {
                   /* var conn = navigator.connection.type;

                    if (conn == Connection.NONE || conn == Connection.UNKNOWN ||
                        conn == Connection.CELL)
                        return false;*/
                    return false;


                } catch (e) {

                    alert(e.toString());
                }

            }

        }
    })
    .factory("Bbdd", function ($q) {
        var db = openDatabase("NotasV2", "", "Base notas", 1024 * 1024,
            function (db) {
                db.transaction(function (tx) {
                        tx.executeSql("create table if not exists Blocs " +
                        "(id unique,nombre,img,descripcion)");

                        tx.executeSql("create table if not exists Notas " +
                        "(id unique,nombre,contenido,idBloc)");


                    },


                    function (err) {

                        alert(err.toString());

                    });
            });

        return {
            guardarBlocs: function (blocs) {
                var db = openDatabase("NotasV2", "", "Base notas", 1024 * 1024);

                db.transaction(function (tx) {
                    tx.executeSql("delete from Blocs");

                    for (var i = 0; i < blocs.length; i++) {

                        tx.executeSql("insert into Blocs values(?,?,?,?)",
                            [blocs[i].id, blocs[i].nombre, blocs[i].img,
                                blocs[i].descripcion]
                        );

                    }


                });


            },
            guardarNotas: function (notas,idBloc) {
                var db = openDatabase("NotasV2", "", "Base notas", 1024 * 1024);

                db.transaction(function (tx) {
                    tx.executeSql("delete from Notas where idBloc=?",[idBloc]);

                    for (var i = 0; i < notas.length; i++) {

                        tx.executeSql("insert into Notas values(?,?,?,?)",
                            [notas[i].id, notas[i].nombre, notas[i].contenido,
                            notas[i].idBloc]
                        );

                    }


                });


            },
            obtenerBlocs:function(){
                var db = openDatabase("NotasV2", "", "Base notas",
                    1024 * 1024);
                var deferred=$q.defer();

                db.transaction(function(tx){

                    tx.executeSql("select * from Blocs",[],
                        function(tran,res){

                            var blocs=[];

                            for(var i=0;i<res.rows.length;i++){
                                var o={
                                    id:res.rows.item(i).id,
                                    nombre:res.rows.item(i).nombre,
                                    img:res.rows.item(i).img,
                                    descripcion:res.rows.item(i).descripcion

                                };
                                blocs.push(o);

                            }


                        deferred.resolve(blocs);

                    },
                    function(tran,err){
                        deferred.reject(err);

                    }
                    );



                });
                return deferred.promise;

            },
            obtenerNotas:function(idBloc){
                var db = openDatabase("NotasV2", "", "Base notas",
                    1024 * 1024);
                var deferred=$q.defer();

                db.transaction(function(tx){

                    tx.executeSql("select * from Notas where idBloc=?"
                        ,[idBloc],
                        function(tran,res){

                            var notas=[];

                            for(var i=0;i<res.rows.length;i++){
                                var o={
                                    id:res.rows.item(i).id,
                                    nombre:res.rows.item(i).nombre,
                                    contenido:res.rows.item(i).contenido,
                                    idBloc:res.rows.item(i).idBloc

                                };
                                notas.push(o);

                            }


                            deferred.resolve(notas);

                        },
                        function(tran,err){
                            deferred.reject(err);

                        }
                    );



                });
                return deferred.promise;

            }

        }
    })
;
