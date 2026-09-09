-- =========================================================
-- MATERIAS
-- =========================================================

INSERT INTO materia (nombre, codigo) VALUES
                                         ('Fundamentos de Programación', '22948'),
                                         ('Algebra Lineal I', '22979'),
                                         ('Programación Orientada a Objetos', '22951'),
                                         ('Matemáticas discretas', '22954'),
                                         ('Estruc. de datos y análisis de alg.', '22955'),
                                         ('Electricidad y Electrónica', '22957'),
                                         ('Autómatas y lenguajes formales', '22958'),
                                         ('Base de Datos I', '22959'),
                                         ('Base de Datos II', '22960'),
                                         ('Sistemas Digitales', '22961'),
                                         ('Pensamiento sistémico y organizacional', '22963'),
                                         ('Redes de Computadores I', '22965'),
                                         ('Arquitectura de Computadores', '22966'),
                                         ('Programación en la Web', '22967'),
                                         ('Sistemas de Información', '22968'),
                                         ('Ingeniería del Software I', '22969'),
                                         ('Redes de Computadores II', '22970'),
                                         ('Inteligencia Artificial I', '22971'),
                                         ('Sistemas Operacionales', '22972'),
                                         ('Ingeniería del Software II', '22973'),
                                         ('Simulación Digital', '22974'),
                                         ('Trabajo de Grado I', '22975'),
                                         ('Trabajo de Grado II', '22977'),
                                         ('Estadística I', '21857'),
                                         ('Estadística II', '21858'),
                                         ('Entornos de programación', '24542'),
                                         ('Ingeniería de software III', '24557'),
                                         ('Inteligencia artificial III', '24558'),
                                         ('Procesamiento de imágenes digitales', '27571'),
                                         ('Principios y prácticas de desarrollo de software orientado a objetos', '28091');


-- =========================================================
-- GRUPOS
-- =========================================================
-- A1 = 06:00 - 08:00
-- B1 = 08:00 - 10:00
-- C1 = 10:00 - 12:00
-- D1 = 12:00 - 14:00
-- E1 = 14:00 - 16:00
-- F1 = 16:00 - 18:00
-- G1 = 18:00 - 20:00
-- H1 = 20:00 - 22:00


INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'B1', 'Carlos Mendoza'
FROM materia
WHERE codigo = '22948';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'C1', 'Andrés Ramírez'
FROM materia
WHERE codigo = '22979';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'F1', 'Julián Herrera'
FROM materia
WHERE codigo = '22951';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'B1', 'Miguel Torres'
FROM materia
WHERE codigo = '22954';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'E1', 'Sebastián Vargas'
FROM materia
WHERE codigo = '22955';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'G1', 'Diego Martínez'
FROM materia
WHERE codigo = '22957';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'C1', 'Felipe Rodríguez'
FROM materia
WHERE codigo = '22958';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'E1', 'Santiago Moreno'
FROM materia
WHERE codigo = '22959';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'G1', 'Alejandro Castillo'
FROM materia
WHERE codigo = '22960';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'B1', 'Daniel Rojas'
FROM materia
WHERE codigo = '22961';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'D1', 'Mauricio Gómez'
FROM materia
WHERE codigo = '22963';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'C1', 'Nicolás Pérez'
FROM materia
WHERE codigo = '22965';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'E1', 'Ricardo Sánchez'
FROM materia
WHERE codigo = '22966';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'G1', 'Esteban Jiménez'
FROM materia
WHERE codigo = '22967';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'B1', 'Juan Carlos Díaz'
FROM materia
WHERE codigo = '22968';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'F1', 'Cristian Romero'
FROM materia
WHERE codigo = '22969';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'G1', 'Leonardo Morales'
FROM materia
WHERE codigo = '22970';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'E1', 'David González'
FROM materia
WHERE codigo = '22971';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'B1', 'Óscar Navarro'
FROM materia
WHERE codigo = '22972';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'F1', 'Héctor Salazar'
FROM materia
WHERE codigo = '22973';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'C1', 'Fernando Duarte'
FROM materia
WHERE codigo = '22974';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'E1', 'Álvaro Méndez'
FROM materia
WHERE codigo = '22975';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'F1', 'Jorge Pineda'
FROM materia
WHERE codigo = '22977';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'B1', 'Manuel Castro'
FROM materia
WHERE codigo = '21857';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'C1', 'Rafael Ortega'
FROM materia
WHERE codigo = '21858';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'F1', 'Luis Fernando León'
FROM materia
WHERE codigo = '24542';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'G1', 'Camilo Fuentes'
FROM materia
WHERE codigo = '24557';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'E1', 'Mateo Cabrera'
FROM materia
WHERE codigo = '24558';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'F1', 'Tomás Valencia'
FROM materia
WHERE codigo = '27571';

INSERT INTO grupo (materia_id, nombre, profesor)
SELECT id, 'C1', 'Gabriel Arias'
FROM materia
WHERE codigo = '28091';


-- =========================================================
-- HORARIOS
-- =========================================================

-- 22948 - Fundamentos de Programación
-- Grupo B1 = 08:00 - 10:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22948' AND g.nombre = 'B1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22948' AND g.nombre = 'B1';


-- 22979 - Algebra Lineal I
-- Grupo C1 = 10:00 - 12:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22979' AND g.nombre = 'C1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22979' AND g.nombre = 'C1';


-- 22951 - Programación Orientada a Objetos
-- Grupo F1 = 16:00 - 18:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22951' AND g.nombre = 'F1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22951' AND g.nombre = 'F1';


-- 22954 - Matemáticas discretas
-- Grupo B1 = 08:00 - 10:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22954' AND g.nombre = 'B1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22954' AND g.nombre = 'B1';


-- 22955 - Estructuras de datos
-- Grupo E1 = 14:00 - 16:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22955' AND g.nombre = 'E1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22955' AND g.nombre = 'E1';


-- 22957 - Electricidad y Electrónica
-- Grupo G1 = 18:00 - 20:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22957' AND g.nombre = 'G1';


-- 22958 - Autómatas y lenguajes formales
-- Grupo C1 = 10:00 - 12:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22958' AND g.nombre = 'C1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22958' AND g.nombre = 'C1';


-- 22959 - Base de Datos I
-- Grupo E1 = 14:00 - 16:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22959' AND g.nombre = 'E1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22959' AND g.nombre = 'E1';


-- 22960 - Base de Datos II
-- Grupo G1 = 18:00 - 20:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22960' AND g.nombre = 'G1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22960' AND g.nombre = 'G1';


-- 22961 - Sistemas Digitales
-- Grupo B1 = 08:00 - 10:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22961' AND g.nombre = 'B1';


-- 22963 - Pensamiento sistémico y organizacional
-- Grupo D1 = 12:00 - 14:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '12:00', '14:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22963' AND g.nombre = 'D1';


-- 22965 - Redes de Computadores I
-- Grupo C1 = 10:00 - 12:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22965' AND g.nombre = 'C1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22965' AND g.nombre = 'C1';


-- 22966 - Arquitectura de Computadores
-- Grupo E1 = 14:00 - 16:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22966' AND g.nombre = 'E1';


-- 22967 - Programación en la Web
-- Grupo G1 = 18:00 - 20:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22967' AND g.nombre = 'G1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22967' AND g.nombre = 'G1';


-- 22968 - Sistemas de Información
-- Grupo B1 = 08:00 - 10:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22968' AND g.nombre = 'B1';


-- 22969 - Ingeniería del Software I
-- Grupo F1 = 16:00 - 18:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22969' AND g.nombre = 'F1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22969' AND g.nombre = 'F1';


-- 22970 - Redes de Computadores II
-- Grupo G1 = 18:00 - 20:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22970' AND g.nombre = 'G1';


-- 22971 - Inteligencia Artificial I
-- Grupo E1 = 14:00 - 16:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22971' AND g.nombre = 'E1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22971' AND g.nombre = 'E1';


-- 22972 - Sistemas Operacionales
-- Grupo B1 = 08:00 - 10:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22972' AND g.nombre = 'B1';


-- 22973 - Ingeniería del Software II
-- Grupo F1 = 16:00 - 18:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22973' AND g.nombre = 'F1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22973' AND g.nombre = 'F1';


-- 22974 - Simulación Digital
-- Grupo C1 = 10:00 - 12:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22974' AND g.nombre = 'C1';


-- 22975 - Trabajo de Grado I
-- Grupo E1 = 14:00 - 16:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22975' AND g.nombre = 'E1';


-- 22977 - Trabajo de Grado II
-- Grupo F1 = 16:00 - 18:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '22977' AND g.nombre = 'F1';


-- 21857 - Estadística I
-- Grupo B1 = 08:00 - 10:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '21857' AND g.nombre = 'B1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '08:00', '10:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '21857' AND g.nombre = 'B1';


-- 21858 - Estadística II
-- Grupo C1 = 10:00 - 12:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '21858' AND g.nombre = 'C1';


-- 24542 - Entornos de programación
-- Grupo F1 = 16:00 - 18:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '24542' AND g.nombre = 'F1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '24542' AND g.nombre = 'F1';


-- 24557 - Ingeniería de Software III
-- Grupo G1 = 18:00 - 20:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Lunes', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '24557' AND g.nombre = 'G1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '18:00', '20:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '24557' AND g.nombre = 'G1';


-- 24558 - Inteligencia Artificial III
-- Grupo E1 = 14:00 - 16:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Martes', '14:00', '16:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '24558' AND g.nombre = 'E1';


-- 27571 - Procesamiento de imágenes digitales
-- Grupo F1 = 16:00 - 18:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Miércoles', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '27571' AND g.nombre = 'F1';

INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Viernes', '16:00', '18:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '27571' AND g.nombre = 'F1';


-- 28091 - Principios y prácticas de desarrollo de software
-- Grupo C1 = 10:00 - 12:00
INSERT INTO horario_grupo (grupo_id, dia, hora_inicio, hora_fin)
SELECT g.id, 'Jueves', '10:00', '12:00'
FROM grupo g
         JOIN materia m ON m.id = g.materia_id
WHERE m.codigo = '28091' AND g.nombre = 'C1';