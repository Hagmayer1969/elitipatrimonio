-- =============================================
--  ELITI PATRIMÔNIO — Dados Iniciais (Seed)
--  Execute APÓS o schema.sql no SQL Editor do Supabase
-- =============================================

-- ---- Unidades ----
insert into unidades (id, nome, "end", cidade, cor, ativa) values
  ('u1', 'ELITI LAB — Cachoeira do Bom Jesus',  'Rua Leonel Pereira, 1728',  'Florianópolis - SC', '#F97316', true),
  ('u2', 'ELITI PRO — Centro',                   'Rua Felipe Schmidt, 515',   'Florianópolis - SC', '#3B82F6', true),
  ('u3', 'ELITI DAY — Palhoça',                  'Av. Caminho Novo, 890',     'Palhoça - SC',       '#10B981', true),
  ('u4', 'ELITI KIDS — Tapera',                  'Rua das Palmeiras, 200',    'Florianópolis - SC', '#8B5CF6', true),
  ('u5', 'ELITI 50+ — Cachoeira do Bom Jesus',   'Rua Leonel Pereira, 1728',  'Florianópolis - SC', '#EC4899', true)
on conflict (id) do nothing;

-- ---- Usuários (Alunos) ----
insert into usuarios (id, nome, email, tel, turma, unidade, ativo) values
  -- ELITI PRO (u2)
  ('usr1',  'Isabela Biazin',                        'isabela@eliti.org',         '', 'PRO',  'u2', true),
  ('usr2',  'João Pedro Vieira de Mello',             'joao.pedro@eliti.org',      '', 'PRO',  'u2', true),
  ('usr3',  'Diogo Maia',                             'diogo@eliti.org',           '', 'PRO',  'u2', true),
  ('usr4',  'Luiz Augusto',                           'luiz.augusto@eliti.org',    '', 'PRO',  'u2', true),
  ('usr5',  'Fabrizio Alvarez Astrada',               'fabrizio@eliti.org',        '', 'PRO',  'u2', true),
  ('usr6',  'João Vitor Marcolino Veiga',             'joao.vitor.m@eliti.org',    '', 'PRO',  'u2', true),
  ('usr7',  'Ben Calebe Dhein Hagmayer',              'ben@eliti.org',             '', 'PRO',  'u2', true),
  ('usr8',  'João Guilherme Stumpf Fernandes',        'joao.guilherme@eliti.org',  '', 'PRO',  'u2', true),
  ('usr9',  'Mateus Collet Lacerda Machado',          'mateus@eliti.org',          '', 'PRO',  'u2', true),
  ('usr10', 'Amanda dos Santos Daros',                'amanda@eliti.org',          '', 'PRO',  'u2', true),
  ('usr11', 'Igor da Silva Dias',                     'igor@eliti.org',            '', 'PRO',  'u2', true),
  ('usr12', 'Didier Emmanuel Tavares',                'didier@eliti.org',          '', '50+',  'u5', true),
  ('usr13', 'Railson de Oliveira Silva',              'railson@eliti.org',         '', 'PRO',  'u2', true),
  ('usr14', 'Tiago Antunes Bugalho',                  'tiago@eliti.org',           '', 'PRO',  'u2', true),
  ('usr15', 'Luan Bernar Moreau Nunes',               'luan@eliti.org',            '', 'PRO',  'u2', true),
  ('usr16', 'Rafa Verde Ochoa Said',                  'rafa@eliti.org',            '', 'PRO',  'u2', true),
  ('usr17', 'Pedro Ferreira Nunes Neto',              'pedro.nunes@eliti.org',     '', 'PRO',  'u2', true),
  ('usr18', 'Jairu David Escalante Duque',            'jairu@eliti.org',           '', 'PRO',  'u2', true),
  ('usr19', 'João Kalebe Carneiro Reis Costa',        'joao.kalebe@eliti.org',     '', 'PRO',  'u2', true),
  ('usr20', 'João Vitor Otoni do Nascimento',         'joao.otoni@eliti.org',      '', 'PRO',  'u2', true),
  ('usr21', 'Jhon Vitor Medeiros',                    'jhon@eliti.org',            '', 'PRO',  'u2', true),
  ('usr22', 'Guilherme Korbes',                       'guilherme@eliti.org',       '', 'PRO',  'u2', true),
  ('usr23', 'Isabelly Marques Bento dos Santos',      'isabelly@eliti.org',        '', 'PRO',  'u2', true),
  ('usr24', 'Emille Victoria Oliveira De Jesus',      'emille.pro@eliti.org',      '', 'PRO',  'u2', true),
  ('usr25', 'Eduardo Beal Pereira',                   'eduardo@eliti.org',         '', 'PRO',  'u2', true),
  -- ELITI DAY (u3)
  ('usr30', 'Kleberson dos Santos Mendes Pinto',      'kleberson@eliti.org',       '', 'DAY',  'u3', true),
  ('usr31', 'Aileen Hadit Cruz Duque',                'aileen@eliti.org',          '', 'DAY',  'u3', true),
  ('usr32', 'Jorge Miguel Feller Monção Camargo',     'jorge@eliti.org',           '', 'DAY',  'u3', true),
  -- ELITI LAB (u1)
  ('usr40', 'Isabella Jacques e Gabriel',             'isabella@eliti.org',        '', 'LAB',  'u1', true),
  ('usr41', 'Ygor Lorenzo Santos Reis',               'ygor@eliti.org',            '', 'LAB',  'u1', true),
  ('usr42', 'Mônica Ayumi da Silva de Jesus',         'monica@eliti.org',          '', 'LAB',  'u1', true),
  ('usr43', 'Adrea Rayane Kasseby Moura',             'adrea@eliti.org',           '', 'LAB',  'u1', true),
  ('usr44', 'elias caleb sousa rodrigues',            'elias@eliti.org',           '', 'LAB',  'u1', true),
  ('usr45', 'José Lorenzo Chin Buitrago',             'jose.lorenzo@eliti.org',    '', 'LAB',  'u1', true),
  ('usr46', 'Jean da Rosa de Oliveira',               'jean@eliti.org',            '', 'LAB',  'u1', true),
  ('usr47', 'Gabriel Antunes Bugalho',                'gabriel.antunes@eliti.org', '', 'LAB',  'u1', true),
  ('usr48', 'Marisela Buitrago Castellanos',          'marisela@eliti.org',        '', 'LAB',  'u1', true),
  ('usr49', 'Karla de la Caridad Rodríguez Álvarez',  'karla@eliti.org',           '', 'LAB',  'u1', true),
  ('usr50', 'Daniel Arthur de Oliveira',              'daniel.arthur@eliti.org',   '', 'LAB',  'u1', true),
  ('usr51', 'Bernardo Ramos de Souza',                'bernardo@eliti.org',        '', 'LAB',  'u1', true),
  -- ELITI KIDS (u4)
  ('usr60', 'Marcieli Kaufmann',                      'marcieli@eliti.org',        '', 'KIDS', 'u4', true),
  ('usr61', 'Igor Alves Morais',                      'igor.alves@eliti.org',      '', 'KIDS', 'u4', true),
  ('usr62', 'Diogo Moreira do Nascimento',            'diogo.moreira@eliti.org',   '', 'KIDS', 'u4', true),
  ('usr63', 'Maria Helena Silva Gomes',               'maria.helena@eliti.org',    '', 'KIDS', 'u4', true),
  ('usr64', 'Gabriel Maracara Gobani Jose Dias',      'gabriel.maracara@eliti.org','', 'KIDS', 'u4', true),
  ('usr65', 'Arthur Kaynan Costa Barbosa',            'arthur@eliti.org',          '', 'KIDS', 'u4', true),
  ('usr66', 'Mayara Antunes Bugalho',                 'mayara@eliti.org',          '', 'KIDS', 'u4', true),
  ('usr67', 'Italo Rafael Sousa Rocha',               'italo@eliti.org',           '', 'KIDS', 'u4', true),
  ('usr68', 'Aníbal Grimón Guillén',                  'anibal@eliti.org',          '', 'KIDS', 'u4', true),
  ('usr69', 'Thaila Vitória dos Santos da Silva',     'thaila@eliti.org',          '', 'KIDS', 'u4', true),
  ('usr70', 'Ana Sophia Silva Gomes',                 'ana.sophia@eliti.org',      '', 'KIDS', 'u4', true),
  ('usr71', 'Emille Victoria',                        'emille.kids@eliti.org',     '', 'KIDS', 'u4', true),
  ('usr72', 'Kelly Belusso',                          'kelly@eliti.org',           '', 'KIDS', 'u4', true),
  ('usr73', 'Daniel Pivetta Schreiner',               'daniel.pivetta@eliti.org',  '', 'KIDS', 'u4', true),
  ('usr74', 'Heverelys Ramirez',                      'heverelys@eliti.org',       '', 'KIDS', 'u4', true),
  ('usr75', 'Ylan Rykelme Nunes dos Santos',          'ylan@eliti.org',            '', 'KIDS', 'u4', true),
  -- ELITI 50+ (u5)
  ('usr80', 'Sabrina da Silva Sobral',                'sabrina@eliti.org',         '', 'PRO',  'u2', true),
  ('usr81', 'Edson Hagmayer',                         'edson@eliti.org',           '', '50+',  'u5', true)
on conflict (id) do nothing;

-- ---- Equipamentos iniciais ----
insert into equipamentos (id, nome, tipo, status, marca, modelo, serie, patrimonio, unidade, usuario, obs, data, valor, epanel_id, sincronizado) values
  ('eq1', 'Notebook Dell Inspiron',  'notebook',    'disponivel', 'Dell',      'Inspiron 15 3511', 'DL2024001', 'PAT-001', 'u2', null, 'Cadastre o responsável clicando no card', '2023-01-15', 2800, 'EP001', true),
  ('eq2', 'Monitor Samsung 24"',     'monitor',     'disponivel', 'Samsung',   'LF24T350',         'SM2024001', 'PAT-002', 'u1', null, '', '2023-01-15', 950,  '',      false),
  ('eq3', 'Teclado Logitech K120',   'teclado',     'disponivel', 'Logitech',  'K120',             'LG2024001', 'PAT-003', 'u1', null, '', '2023-01-15', 120,  '',      false),
  ('eq4', 'Mouse Logitech M100',     'mouse',       'disponivel', 'Logitech',  'M100',             'LG2024002', 'PAT-004', 'u1', null, '', '2023-01-15', 80,   '',      false),
  ('eq5', 'USB Internet Intelbras',  'usb_internet','disponivel', 'Intelbras', 'ACtion A1200',     'IB2024001', 'PAT-005', 'u1', null, '', '2023-01-15', 60,   '',      false),
  ('eq6', 'Notebook Dell Inspiron',  'notebook',    'disponivel', 'Dell',      'Inspiron 15 3511', 'DL2024002', 'PAT-006', 'u2', null, '', '2023-03-10', 2800, 'EP006', true),
  ('eq7', 'PC Desktop Positivo',     'pc',          'disponivel', 'Positivo',  'Master D570',      'PO2024001', 'PAT-007', 'u2', null, 'Aguardando alocação', '2023-06-01', 1800, '', false),
  ('eq8', 'Notebook Lenovo IdeaPad', 'notebook',    'manutencao', 'Lenovo',    'IdeaPad 3',        'LN2024003', 'PAT-008', 'u1', null, 'Tela quebrada - aguardando conserto', '2022-11-20', 2500, '', false)
on conflict (id) do nothing;
