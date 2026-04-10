insert into companies (name, tax_id)
values ('Portal IT Services', 'B12345678');

insert into work_categories (name, description)
values
  ('Office 365', 'Correo, SharePoint, Teams y licencias'),
  ('Impresoras', 'Colas, drivers y conectividad'),
  ('Redes', 'Switches, wifi, cableado y firewalls'),
  ('Copias de seguridad', 'Backups locales, NAS y cloud'),
  ('RDP / TSplus', 'Escritorio remoto y acceso remoto'),
  ('Windows', 'Sistema operativo, perfiles y actualizaciones');

insert into work_statuses (name, color, is_closed)
values
  ('Pendiente', '#f59e0b', false),
  ('En seguimiento', '#0ea5e9', false),
  ('Resuelto', '#10b981', false),
  ('Cerrado', '#64748b', true);
