document.addEventListener('DOMContentLoaded', () => {
    const btnTrabajadores = document.getElementById('btnTrabajadores');
    const btnSedes = document.getElementById('btnSedes');
    const content = document.getElementById('content');

    btnTrabajadores.addEventListener('click', () => {
        fetch('http://localhost:3000/trabajadores')
            .then(response => response.json())
            .then(data => displayTrabajadores(data))
            .catch(error => console.error('Error fetching data:', error));
    });

    btnSedes.addEventListener('click', () => {
        fetch('http://localhost:3000/sedes')
            .then(response => response.json())
            .then(data => displaySedes(data))
            .catch(error => console.error('Error fetching data:', error));
    });

    function displayTrabajadores(trabajadores) {
        content.innerHTML = '<h2>Trabajadores</h2>';
        if (trabajadores.length === 0) {
            content.innerHTML += '<p>No hay trabajadores disponibles.</p>';
        } else {
            const table = document.createElement('table');
            const headers = ['Nombres', 'Correo', 'Detalles'];
            const headerRow = document.createElement('tr');

            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            table.appendChild(headerRow);

            trabajadores.forEach(trabajador => {
                const row = document.createElement('tr');

                const nombresCell = document.createElement('td');
                nombresCell.textContent = `${trabajador.nombres} ${trabajador.apellidos}`;
                row.appendChild(nombresCell);

                const correoCell = document.createElement('td');
                correoCell.textContent = trabajador.correo;
                row.appendChild(correoCell);

                const detallesCell = document.createElement('td');
                const detallesBtn = document.createElement('button');
                detallesBtn.textContent = 'Ver Detalles';
                detallesBtn.addEventListener('click', () => {
                    mostrarDetallesTrabajador(trabajador);
                });
                detallesCell.appendChild(detallesBtn);
                row.appendChild(detallesCell);

                table.appendChild(row);
            });

            content.appendChild(table);
        }
    }

    function displaySedes(sedes) {
        content.innerHTML = '<h2>Sedes</h2>';
        if (sedes.length === 0) {
            content.innerHTML += '<p>No hay sedes disponibles.</p>';
        } else {
            const table = document.createElement('table');
            const headers = ['Nombre', 'Dirección', 'Detalles'];
            const headerRow = document.createElement('tr');

            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });

            table.appendChild(headerRow);

            sedes.forEach(sede => {
                const row = document.createElement('tr');

                const nombreCell = document.createElement('td');
                nombreCell.textContent = sede.nombreSede;
                row.appendChild(nombreCell);

                const direccionCell = document.createElement('td');
                direccionCell.textContent = sede.direccion;
                row.appendChild(direccionCell);

                const detallesCell = document.createElement('td');
                const detallesBtn = document.createElement('button');
                detallesBtn.textContent = 'Ver Detalles';
                detallesBtn.addEventListener('click', () => {
                    mostrarDetallesSede(sede);
                });
                detallesCell.appendChild(detallesBtn);
                row.appendChild(detallesCell);

                table.appendChild(row);
            });

            content.appendChild(table);
        }
    }

    function mostrarDetallesTrabajador(trabajador) {
        fetch(`http://localhost:3000/trabajadores/ventas/${trabajador.dni}`)
            .then(response => response.json())
            .then(ventas => {
                content.innerHTML = `<h2>Detalles del Trabajador</h2>
                             <p><strong>Nombres:</strong> ${trabajador.nombres} ${trabajador.apellidos}</p>
                             <p><strong>Correo:</strong> ${trabajador.correo}</p>
                             <h3>Listado de Ventas</h3>
                             <ul id="listaVentas"></ul>
                             <button id="btnVolver">Volver a la Lista de Trabajadores</button>`;
                const listaVentas = document.getElementById('listaVentas');

                if (ventas.length === 0) {
                    listaVentas.innerHTML = '<p>No hay ventas realizadas por este trabajador.</p>';
                } else {
                    ventas.forEach(venta => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `ID Venta: ${venta.idventa}, Fecha: ${venta.fecha}`;
                        listaVentas.appendChild(listItem);
                    });
                }

                const btnVolver = document.getElementById('btnVolver');

                btnVolver.addEventListener('click', () => {
                    displayTrabajadores();
                });
            })
            .catch(error => console.error('Error fetching ventas:', error));
    }

    function mostrarDetallesSede(sede) {
        fetch(`http://localhost:3000/sedes/trabajadores/${sede.idsede}`)
            .then(response => response.json())
            .then(trabajadores => {
                content.innerHTML = `<h2>Detalles de la Sede</h2>
                             <p><strong>Nombre:</strong> ${sede.nombreSede}</p>
                             <p><strong>Dirección:</strong> ${sede.direccion}</p>
                             <button id="btnVolver">Volver a la Lista de Sedes</button>
                             <h3>Listado de Trabajadores</h3>
                             <ul id="listaTrabajadores"></ul>`;
                const listaTrabajadores = document.getElementById('listaTrabajadores');

                if (trabajadores.length === 0) {
                    listaTrabajadores.innerHTML = '<p>No hay trabajadores asignados a esta sede.</p>';
                } else {
                    trabajadores.forEach(trabajador => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `<strong>Nombres:</strong> ${trabajador.nombres} ${trabajador.apellidos}<br>
                                  <strong>Correo:</strong> ${trabajador.correo}<br>
                                  <button class="btnVerDetallesTrabajador">Ver Detalles de Trabajador</button>`;
                        listItem.querySelector('.btnVerDetallesTrabajador').addEventListener('click', () => {
                            mostrarDetallesTrabajador(trabajador);
                        });
                        listaTrabajadores.appendChild(listItem);
                    });
                }

                const btnVolver = document.getElementById('btnVolver');

                btnVolver.addEventListener('click', () => {
                    displaySedes();
                });
            })
            .catch(error => console.error('Error fetching trabajadores:', error));
    }
});
