-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-05-2026 a las 01:36:35
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `coachingnew`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `actividad` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `sesion_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tipo_contenido_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alternativas`
--

CREATE TABLE `alternativas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `alternativa` text DEFAULT NULL,
  `score` int(11) DEFAULT 0,
  `vigente` int(11) DEFAULT 0,
  `letra` varchar(255) DEFAULT NULL,
  `cuadrante` int(11) DEFAULT NULL,
  `definicion` varchar(255) DEFAULT NULL,
  `grupo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `evaluacion_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pregunta_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `alternativas`
--

INSERT INTO `alternativas` (`id`, `alternativa`, `score`, `vigente`, `letra`, `cuadrante`, `definicion`, `grupo`, `created_at`, `updated_at`, `evaluacion_id`, `estado_id`, `pregunta_id`) VALUES
(1, 'Dar importancia al uso de procedimientos uniformes y a la necesidad de cumplir con la tarea.', 2, 0, 'A', 1, NULL, NULL, NULL, NULL, 1, 1, 1),
(2, 'Estar disponible para discutir el asunto, pero sin presionar', -1, 0, 'B', 3, NULL, NULL, NULL, NULL, 1, 1, 1),
(3, 'Hablar con los colaboradores y luego fijar las metas.', 1, 0, 'C', 2, NULL, NULL, NULL, NULL, 1, 1, 1),
(4, 'No intervenir intencionadamente.', -2, 0, 'D', 4, NULL, NULL, NULL, NULL, 1, 1, 1),
(5, 'Crear, una relaciÃ³n cordial, pero continuarla asegurÃ¡ndome que todos los miembros sean conscientes de sus responsabilidades y de los niveles de rendimiento que de ellos se espera.', 2, 0, 'A', 2, NULL, NULL, NULL, NULL, 1, 1, 2),
(6, 'No realizar ninguna acciÃ³n determinada.', -2, 0, 'B', 4, NULL, NULL, NULL, NULL, 1, 1, 2),
(7, 'Hacer lo que pueda para que el grupo se sienta importante e involucrado.', 1, 0, 'C', 3, NULL, NULL, NULL, NULL, 1, 1, 2),
(8, 'Recalcar la importancia de los plazos lÃ­mites para los trabajos y las tareas.', -1, 0, 'D', 1, NULL, NULL, NULL, NULL, 1, 1, 2),
(9, 'Involucrar al grupo y juntos tratar de solucionar los problemas.', 1, 0, 'A', 2, NULL, NULL, NULL, NULL, 1, 1, 3),
(10, 'Dejar que el grupo lo resuelva solo.', -1, 0, 'B', 4, NULL, NULL, NULL, NULL, 1, 1, 3),
(11, 'Actuar rÃ¡pidamente y firmemente para corregir la situaciÃ³n y dirigir al grupo.', -2, 0, 'C', 1, NULL, NULL, NULL, NULL, 1, 1, 3),
(12, 'Estimular al grupo a trabajar en el problema y estar a su disposiciÃ³n para cualquier discusiÃ³n.', 2, 0, 'D', 3, NULL, NULL, NULL, NULL, 1, 1, 3),
(13, 'Permitir que el grupo se involucre en el desarrollo del cambio, sin ser demasiado autoritario.', 1, 0, 'A', 3, NULL, NULL, NULL, NULL, 1, 1, 4),
(14, 'Comunicar los cambios y luego hacer que se cumplan bajo una estricta supervisiÃ³n.', -2, 0, 'B', 1, NULL, NULL, NULL, NULL, 1, 1, 4),
(15, 'Permitir que el grupo formule su propia direcciÃ³n.', 2, 0, 'C', 4, NULL, NULL, NULL, NULL, 1, 1, 4),
(16, 'Incorporar a la soluciÃ³n las recomendaciones del grupo, pero dirigiendo yo el cambio.', -1, 0, 'D', 2, NULL, NULL, NULL, NULL, 1, 1, 4),
(17, 'Permitir que el grupo formule su propia direcciÃ³n.', -2, 0, 'A', 4, NULL, NULL, NULL, NULL, 1, 1, 5),
(18, 'Incorporar a la soluciÃ³n las recomendaciones del grupo, pero vigilando que se alcancen los objetivos.', 1, 0, 'B', 2, NULL, NULL, NULL, NULL, 1, 1, 5),
(19, 'Redefinir los roles y responsabilidades y supervisar estrictamente.', 2, 0, 'C', 1, NULL, NULL, NULL, NULL, 1, 1, 5),
(20, 'Permitir que el grupo se involucre en tu fijaciÃ³n de metas, pero sin ser demasiado autoritario.', -1, 0, 'D', 3, NULL, NULL, NULL, NULL, 1, 1, 5),
(21, 'Hacer lo que pueda para que el grupo se sienta importante e involucrado en los asuntos.', -1, 0, 'A', 3, NULL, NULL, NULL, NULL, 1, 1, 6),
(22, 'Dar importancia a los plazos lÃ­mites para los trabajos y tareas.', 1, 0, 'B', 1, NULL, NULL, NULL, NULL, 1, 1, 6),
(23, 'No intervenir intencionadamente.', -2, 0, 'C', 4, NULL, NULL, NULL, NULL, 1, 1, 6),
(24, 'Hacer que el grupo se involucre en la toma de decisiones, pero vigilar que se alcancen los objetivos.', 2, 0, 'D', 2, NULL, NULL, NULL, NULL, 1, 1, 6),
(25, 'Definir el cambio y supervisarlo estrictamente.', -2, 0, 'A', 1, NULL, NULL, NULL, NULL, 1, 1, 7),
(26, 'Participar con el grupo en el desarrollo del cambio, pero dejar que los miembros organicen la realizaciÃ³n.', 2, 0, 'B', 3, NULL, NULL, NULL, NULL, 1, 1, 7),
(27, 'Mostrarse dispuesto a hacer los cambios recomendados, pero manteniendo el control de la realizaciÃ³n de la misma.', -1, 0, 'C', 2, NULL, NULL, NULL, NULL, 1, 1, 7),
(28, 'Evitar la confrontaciÃ³n, dejando las cosas como estÃ¡n.', 1, 0, 'D', 4, NULL, NULL, NULL, NULL, 1, 1, 7),
(29, 'Dejar al grupo solo.', 2, 0, 'A', 4, NULL, NULL, NULL, NULL, 1, 1, 8),
(30, 'Discutir la situaciÃ³n con el grupo y luego iniciar yo mismo los cambios necesarios.', -1, 0, 'B', 2, NULL, NULL, NULL, NULL, 1, 1, 8),
(31, 'Tomar medidas para dirigir a los subordinados para que trabajen de una manera determinada.', -2, 0, 'C', 1, NULL, NULL, NULL, NULL, 1, 1, 8),
(32, 'Mostrar que respaldo al grupo en la discusiÃ³n de la situaciÃ³n y no mostrarse autoritario.', 1, 0, 'D', 3, NULL, NULL, NULL, NULL, 1, 1, 8),
(33, 'Dejar que el grupo busque solo las soluciones a sus problemas.', -2, 0, 'A', 4, NULL, NULL, NULL, NULL, 1, 1, 9),
(34, 'Incorporar a la soluciÃ³n las recomendaciones del grupo, pero vigilar que se alcancen los objetivos.', 1, 0, 'B', 2, NULL, NULL, NULL, NULL, 1, 1, 9),
(35, 'Definir los niveles de calidad y supervisar cuidadosamente.', 2, 0, 'C', 1, NULL, NULL, NULL, NULL, 1, 1, 9),
(36, 'Permitir que el grupo intervenga en determinaciÃ³n de los objetivos, pero sin presionar.', -1, 0, 'D', 3, NULL, NULL, NULL, NULL, 1, 1, 9),
(37, 'Permitir que el grupo intervenga en la redefiniciÃ³n de los niveles de calidad, pero sin tomar en sus manos el control.', 1, 0, 'A', 3, NULL, NULL, NULL, NULL, 1, 1, 10),
(38, 'Redefinir los niveles de calidad y supervisar cuidadosamente.', -2, 0, 'B', 1, NULL, NULL, NULL, NULL, 1, 1, 10),
(39, 'Evitar la confrontaciÃ³n a travÃ©s de no aplicar presiÃ³n', -1, 0, 'C', 4, NULL, NULL, NULL, NULL, 1, 1, 10),
(40, 'Incorporar a la soluciÃ³n las recomendaciones del grupo, pero vigilar que se alcancen los niveles de calidad.', 2, 0, 'D', 2, NULL, NULL, NULL, NULL, 1, 1, 10),
(41, 'Tomar medidas para conseguir que los colaboradores trabajen de una manera determinada.', -2, 0, 'A', 1, NULL, NULL, NULL, NULL, 1, 1, 11),
(42, 'Hacer que los colaboradores se vean involucrado en la toma de decisiones y reforzar las buenas contribuciones.', 2, 0, 'B', 3, NULL, NULL, NULL, NULL, 1, 1, 11),
(43, 'Discutir el rendimiento previo con el grupo y luego examinar la necesidad de prÃ¡cticas nuevas.', -1, 0, 'C', 2, NULL, NULL, NULL, NULL, 1, 1, 11),
(44, 'Continuar dejando libre al grupo.', 1, 0, 'D', 4, NULL, NULL, NULL, NULL, 1, 1, 11),
(45, 'Probar con los colaboradores la soluciÃ³n propuesta por mÃ­ mismo y examinar la necesidad de nuevas prÃ¡cticas.', -1, 0, 'A', 2, NULL, NULL, NULL, NULL, 1, 1, 12),
(46, 'Permitir que los miembros del grupo encuentren solos las soluciones.', 2, 0, 'B', 4, NULL, NULL, NULL, NULL, 1, 1, 12),
(47, 'Actuar rÃ¡pida y firmemente para corregir y dirigir.', -2, 0, 'C', 1, NULL, NULL, NULL, NULL, 1, 1, 12),
(48, 'Participar en la discusiÃ³n del problema proporcionando apoyo a los colaboradores.', 1, 0, 'D', 3, NULL, NULL, NULL, NULL, 1, 1, 12),
(49, 'Te sientes molesto, pero le dices la verdad: â€œLo que estÃ¡s haciendo me disgusta, por favor deja de hacerloâ€_x009d_', 3, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 13),
(50, 'Te enfureces, le dices: â€œÂ¡No me molestes!, Â¡MÃ¡s te vale que no vuelvas hacerlo!', 2, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 13),
(51, 'Te quedas callado y actÃºas como si nada te hubiese dicho.', 1, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 13),
(52, 'Saludarle como si nada y decirle â€œEntra, la cena estÃ¡ en la mesaâ€_x009d_.', 1, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 14),
(53, 'He estado esperando durante una hora sin saber lo que pasaba. Me has puesto nervioso e irritado, si otra vez te retrasas avÃ­same, harÃ¡s la espera mÃ¡s agradable.', 3, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 14),
(54, 'Le digo â€œÂ¡Â¿Tan tarde llegas?! Nunca mÃ¡s te vuelvo a invitarâ€¦ Â¡Â¿No puedes ser puntual?!â€_x009d_', 2, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 14),
(55, 'Le digo que estoy bastante ocupado, pero si no consigue hacerlo, le puedo ayudar.', 1, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 15),
(56, 'Le digo que es un desconsiderado, que yo tambiÃ©n tengo tareas por hacer, y que las haga Ã©l.', 2, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 15),
(57, 'Le digo;  siempre me pides que te ayude en tus tareas. Porque no te da el tiempo o porque no sabes hacerlo, pero ya estoy cansado de hacer tu trabajo,\nintenta hacerlo tú mismo, así la próxima vez te costará menos y aprenderás a ser responsable.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 15),
(58, 'No digo nada y uso el vaso sucio aunque me disguste.', 1, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 16),
(59, 'Armo un gran escÃ¡ndalo en el local y digo al mozo que como el servicio es asqueroso nunca volverÃ© a ir a ese establecimiento.', 2, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 16),
(60, 'Llamo al mozo y  pido que por favor me cambie el vaso.', 3, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 16),
(61, 'Le digo en voz alta para que otros escuchen, que se ha colado, que respete la fija, y que no sea fresco, que espere su turno.', 2, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 17),
(62, 'Me quedo callado(a), al fin y al cabo todos vamos ser atendidos.', 1, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 17),
(63, 'Le digo que por favor se ubique en la fija porque he estado aquÃ­ antes que Ã©l. Y debe de respetar la fila.', 3, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 17),
(64, 'Le hago entender que todos podemos proponer ideas, sean correctas o erradas, y que si es errada hay que saber decirlo.', 3, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 18),
(65, 'Me quedo callado (a), y nunca mÃ¡s vuelvo a proponer mÃ¡s ideas.', 1, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 18),
(66, 'Me enojo con la persona, y le digo: â€œMejor hazlo tÃº.â€_x009d_, sino puedo opinar no trabajo con Uds.', 2, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 18),
(67, 'Le digo que por favor apague su celular, y que se retire porque causa desorden.', 3, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 19),
(68, 'Le digo en voz alta directamente y mostrando mi molestia, diciÃ©ndole que aquÃ­ no es  lugar para hablar por telÃ©fono, que sea educado y Â¡Â¡Â¡respete!!!!.', 2, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 19),
(69, 'No le digo nada, aunque me disgusta que no puedo escuchar la pelÃ­cula. Prefiero no pelearme.', 1, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 19),
(70, 'Me niego, y agradezco la invitaciÃ³n.', 3, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 20),
(71, 'Acepto aunque no quiera', 1, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 20),
(72, 'Le digo que estÃ¡ loco, que nunca bailarÃ­a como alguien como Ã©l.', 2, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 20),
(73, 'Les grito que se callen y que  todos podemos cometer errores, que ellos tambiÃ©n se han equivocado y que yo no he sido mal educado riÃ©ndome.', 2, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 21),
(74, 'Evito volver a dar mis opiniones, tengo miedo de quedar otra vez como un tonto(a)', 1, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 21),
(75, 'Les digo: â€œDisculpa si mi respuesta ha estado mal, pero por favor no te burles, porque todos podemos cometer errores, al igual que tÃº o yo.\"', 3, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 21),
(76, 'Lo regaÃ±as en voz alta para que todos se enteren de tu reclamo.', 2, 0, 'a', 0, NULL, NULL, NULL, NULL, 2, 1, 22),
(77, 'Le digo solo a Ã©l, que por favor no vuelva a llegar retrasado, que esa impuntualidad nos afecta a todos en las metas y que haga un esfuerzo por ser puntual.', 3, 0, 'b', 0, NULL, NULL, NULL, NULL, 2, 1, 22),
(78, 'No digo nada, no me atrevo a recriminarle, aunque  no me agrada la idea.', 1, 0, 'c', 0, NULL, NULL, NULL, NULL, 2, 1, 22),
(79, 'En ocasiones dejo a otro que asuma la responsabilidad de resolver el problema.', 0, 0, 'a', 4, NULL, NULL, NULL, NULL, 6, 1, 104),
(80, 'En lugar de negociar sobre los aspectos en que no estamos de acuerdo, yo trato de enfatizar los puntos en lo que si estamos de acuerdo.', 0, 0, 'b', 5, NULL, NULL, NULL, NULL, 6, 1, 104),
(81, 'Trato de encontrar una soluciÃ³n en que ambos estemos de acuerdo.', 0, 0, 'a', 3, NULL, NULL, NULL, NULL, 6, 1, 105),
(82, 'Intento manejar mis intereses, asÃ­ como tambiÃ©n los intereses de la otra persona.', 0, 0, 'b', 2, NULL, NULL, NULL, NULL, 6, 1, 105),
(83, 'Habitualmente intento alcanzar mis metas con firmeza.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 6, 1, 106),
(84, 'Intento apaciguar los sentimientos de la otra persona y conservar nuestra relaciÃ³n.', 0, 0, 'b', 5, NULL, NULL, NULL, NULL, 6, 1, 106),
(85, 'Trato de encontrar una soluciÃ³n en que ambos estemos de acuerdo.', 0, 0, 'a', 3, NULL, NULL, NULL, NULL, 6, 1, 107),
(86, 'Algunas veces sacrifico mis propios deseos por los deseos de la otra persona.', 0, 0, 'b', 5, NULL, NULL, NULL, NULL, 6, 1, 107),
(87, 'Consistentemente busco la ayuda de la otra persona para encontrar una soluciÃ³n.', 0, 0, 'a', 2, NULL, NULL, NULL, NULL, 6, 1, 108),
(88, 'Trato de hacer lo que sea necesario para evitar tensiones inÃºtiles.', 0, 0, 'b', 4, NULL, NULL, NULL, NULL, 6, 1, 108),
(89, 'Trato de evitar crearme una situaciÃ³n desagradable.', 0, 0, 'a', 4, NULL, NULL, NULL, NULL, 6, 1, 109),
(90, 'Busco triunfar en mi postura.', 0, 0, 'b', 1, NULL, NULL, NULL, NULL, 6, 1, 109),
(91, 'Intento posponer el asunto hasta que tenga tiempo para pensarlo.', 0, 0, 'a', 4, NULL, NULL, NULL, NULL, 6, 1, 110),
(92, 'Renuncio a ciertos puntos de vista para ganar a otros.', 0, 0, 'b', 3, NULL, NULL, NULL, NULL, 6, 1, 110),
(93, 'Generalmente soy firme en la persecuciÃ³n de mis metas.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 6, 1, 111),
(94, 'Intento expresar abiertamente todas las preocupaciones y problemas de inmediato.', 0, 0, 'b', 2, NULL, NULL, NULL, NULL, 6, 1, 111),
(95, 'Siento que no siempre vale la pena preocuparme por las diferencias.', 0, 0, 'a', 4, NULL, NULL, NULL, NULL, 6, 1, 120),
(96, 'Me esfuerzo por ganar mis metas.', 0, 0, 'b', 1, NULL, NULL, NULL, NULL, 6, 1, 120),
(97, 'Soy firme para lograr mis metas.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 6, 1, 121),
(98, 'Intento encontrar una soluciÃ³n en que ambos estemos de acuerdo.', 0, 0, 'b', 3, NULL, NULL, NULL, NULL, 6, 1, 121),
(99, 'De inmediato intento sacar a la luz todos los problemas.', 0, 0, 'a', 2, NULL, NULL, NULL, NULL, 6, 1, 122),
(100, 'Intento apaciguar los sentimientos de la otra persona y conservar nuestra relaciÃ³n.', 0, 0, 'b', 5, NULL, NULL, NULL, NULL, 6, 1, 122),
(101, 'En ocasiones evito expresar opiniones que puedan crear controversia.', 0, 0, 'a', 4, NULL, NULL, NULL, NULL, 6, 1, 123),
(102, 'Lo dejo que conserve algo de su posiciÃ³n si el me deja conservar algo de la mÃ­a.', 0, 0, 'b', 3, NULL, NULL, NULL, NULL, 6, 1, 123),
(103, 'Frecuentemente propongo acuerdos.', 0, 0, 'a', 3, NULL, NULL, NULL, NULL, 6, 1, 124),
(104, 'Presiono para dejar bien clara mi posiciÃ³n.', 0, 0, 'b', 1, NULL, NULL, NULL, NULL, 6, 1, 124),
(105, 'Explico mis ideas a la otra persona y le pido que me explique las suyas.', 0, 0, 'a', 2, NULL, NULL, NULL, NULL, 6, 1, 125),
(106, 'Intento demostrar la lÃ³gica y beneficios de mi postura.', 0, 0, 'b', 1, NULL, NULL, NULL, NULL, 6, 1, 125),
(107, 'Me pongo en el lugar de la otra persona para comprenderlo bien.', 0, 0, 'a', 5, NULL, NULL, NULL, NULL, 6, 1, 126),
(108, 'Prefiero meditar concienzudamente antes de decidir quÃ© hacer.', 0, 0, 'b', 4, NULL, NULL, NULL, NULL, 6, 1, 126),
(109, 'Cedo en algunos puntos con tal de satisfecha a la otra persona.', 0, 0, 'a', 5, NULL, NULL, NULL, NULL, 6, 1, 127),
(110, 'Defiendo con intensidad mi postura.', 0, 0, 'b', 1, NULL, NULL, NULL, NULL, 6, 1, 127),
(111, 'Usualmente persigo mis metas con firmeza.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 6, 1, 128),
(112, 'Intento hacer lo que sea necesario para evitar tensiones inÃºtiles.', 0, 0, 'b', 4, NULL, NULL, NULL, NULL, 6, 1, 128),
(113, 'Dejo que la otra persona sostenga su punto de vista si esto la hace feliz.', 0, 0, 'a', 5, NULL, NULL, NULL, NULL, 6, 1, 129),
(114, 'Dejo que la otra gane algunos argumentos si me permite ganar a mÃ­ algunos de los mÃ­os.', 0, 0, 'b', 3, NULL, NULL, NULL, NULL, 6, 1, 129),
(115, 'De inmediato intento sacar a la luz todos los intereses y problemas.', 0, 0, 'a', 2, NULL, NULL, NULL, NULL, 6, 1, 130),
(116, 'Intento posponer los problemas hasta que he tenido tiempo de pensar.', 0, 0, 'b', 4, NULL, NULL, NULL, NULL, 6, 1, 130),
(117, 'Si tengo diferencias con alguien de inmediato intento tratarlas.', 0, 0, 'a', 2, NULL, NULL, NULL, NULL, 6, 1, 131),
(118, 'Intento encontrar una justa combinaciÃ³n de puntos ganados y perdidos para ambos.', 0, 0, 'b', 3, NULL, NULL, NULL, NULL, 6, 1, 131),
(119, 'Al abordar las negociaciones, intento ser considerado hacia los deseos de la otra persona.', 0, 0, 'a', 5, NULL, NULL, NULL, NULL, 6, 1, 132),
(120, 'Siempre me inclino a tener abierta una soluciÃ³n al problema.', 0, 0, 'b', 2, NULL, NULL, NULL, NULL, 6, 1, 132),
(121, 'En una discusiÃ³n intento encontrar una postura intermedia entre su opiniÃ³n y la mÃ­a.', 0, 0, 'a', 3, NULL, NULL, NULL, NULL, 6, 1, 133),
(122, 'Afirmo mis deseos.', 0, 0, 'b', 1, NULL, NULL, NULL, NULL, 6, 1, 133),
(123, 'Con frecuencia me interesa mucho satisfacer todos nuestros deseos.', 0, 0, 'a', 2, NULL, NULL, NULL, NULL, 6, 1, 134),
(124, 'En ocasiones dejo que otros asuman la responsabilidad de resolver el problema.', 0, 0, 'b', 4, NULL, NULL, NULL, NULL, 6, 1, 134),
(125, 'Si la opiniÃ³n de la otra persona parece ser muy importante para Ã©l, intentarÃ­a cumplir con sus deseos.', 0, 0, 'a', 5, NULL, NULL, NULL, NULL, 6, 1, 135),
(126, 'Intento hacerla  desistir.', 0, 0, 'b', 3, NULL, NULL, NULL, NULL, 6, 1, 135),
(127, 'Intento mostrarle la lÃ³gica y los beneficios de mi postura.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 6, 1, 136),
(128, 'Al abordar las negociaciones, intento ser considerado hacia los deseos de la otra persona.', 0, 0, 'b', 5, NULL, NULL, NULL, NULL, 6, 1, 136),
(129, 'Si enfrento diferencias con alguien, propongo que ambos lleguemos a un acuerdo.', 0, 0, 'a', 3, NULL, NULL, NULL, NULL, 6, 1, 137),
(130, 'Casi siempre me interesa satisfacer todos nuestros deseos.', 0, 0, 'b', 2, NULL, NULL, NULL, NULL, 6, 1, 137),
(131, 'En ocasiones evito asumir posturas que puedan crear controversias.', 0, 0, 'a', 4, NULL, NULL, NULL, NULL, 6, 1, 138),
(132, 'Dejo que la otra persona sostenga sus puntos de vista si esto la hace feliz.', 0, 0, 'b', 5, NULL, NULL, NULL, NULL, 6, 1, 138),
(133, 'Usualmente persigo mis metas con firmeza.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 6, 1, 139),
(134, 'Usualmente busco la ayuda de la otra persona para encontrar una soluciÃ³n.', 0, 0, 'b', 2, NULL, NULL, NULL, NULL, 6, 1, 139),
(135, 'Cuando existe alguna diferencia con alguien, propongo que ambos lleguemos a un acuerdo.', 0, 0, 'a', 3, NULL, NULL, NULL, NULL, 6, 1, 140),
(136, 'Siento que no siempre vale la pena preocuparse por las diferencias.', 0, 0, 'b', 4, NULL, NULL, NULL, NULL, 6, 1, 140),
(137, 'Intento no lastimar los sentimientos de la otra persona.', 0, 0, 'a', 5, NULL, NULL, NULL, NULL, 6, 1, 141),
(138, 'Siempre comparto el problema con la otra persona, con el fin de llegar a una soluciÃ³n.', 0, 0, 'b', 2, NULL, NULL, NULL, NULL, 6, 1, 141),
(139, 'Discriminando. Distinguiendo una cosa de otra.', 0, 0, 'a', 0, NULL, NULL, NULL, NULL, 7, 1, 142),
(140, 'Ensayando. Ensayando para mejor uso posterior.', 0, 0, 'b', 19, NULL, NULL, NULL, NULL, 7, 1, 142),
(141, 'ComprometiÃ©ndome. InvolucrÃ¡ndome.', 0, 0, 'c', 0, NULL, NULL, NULL, NULL, 7, 1, 142),
(142, 'Practicando. Poniendo en prÃ¡ctica lo aprendido.', 0, 0, 'd', 21, NULL, NULL, NULL, NULL, 7, 1, 142),
(143, 'Receptivamente.Ã‰nfasis en recibir.', 0, 0, 'a', 18, NULL, NULL, NULL, NULL, 7, 1, 143),
(144, 'Ensayando. Ensayando para mejor uso posterior.', 0, 0, 'b', 0, NULL, NULL, NULL, NULL, 7, 1, 143),
(145, 'AnalÃ­ticamente. Descomponiendo el todo en partes.', 0, 0, 'c', 20, NULL, NULL, NULL, NULL, 7, 1, 143),
(146, 'Imparcialmente. Sin tomar partido.', 0, 0, 'd', 0, NULL, NULL, NULL, NULL, 7, 1, 143),
(147, 'Sintiendo. Experimentando sensaciones.', 0, 0, 'a', 18, NULL, NULL, NULL, NULL, 7, 1, 144),
(148, 'Observando. Examinando atentamente.', 0, 0, 'b', 19, NULL, NULL, NULL, NULL, 7, 1, 144),
(149, 'Pensando. Examinando con cuidado para formarme un juicio.', 0, 0, 'c', 20, NULL, NULL, NULL, NULL, 7, 1, 144),
(150, 'Haciendo. Con atenciÃ³n y cuidado.', 0, 0, 'd', 21, NULL, NULL, NULL, NULL, 7, 1, 144),
(151, 'Aceptando. Aprobando.', 0, 0, 'a', 18, NULL, NULL, NULL, NULL, 7, 1, 145),
(152, 'Corriendo Riesgos. ExponiÃ©ndome.', 0, 0, 'b', 0, NULL, NULL, NULL, NULL, 7, 1, 145),
(153, 'Cuidadosamente. Examinando el valor de los contenidos.', 0, 0, 'c', 20, NULL, NULL, NULL, NULL, 7, 1, 145),
(154, 'Evaluando. Con atenciÃ³n y cuidado.', 0, 0, 'd', 0, NULL, NULL, NULL, NULL, 7, 1, 145),
(155, 'Intuitivamente. Teniendo percepciones tal como si las estuviera viendo.', 0, 0, 'a', 18, NULL, NULL, NULL, NULL, 7, 1, 146),
(156, 'Productivamente. Con resultados a la vista.', 0, 0, 'b', 0, NULL, NULL, NULL, NULL, 7, 1, 146),
(157, 'LÃ³gicamente. Descubriendo de modo lÃ³gico.', 0, 0, 'c', 20, NULL, NULL, NULL, NULL, 7, 1, 146),
(158, 'Interrogando. Preguntando.', 0, 0, 'd', 0, NULL, NULL, NULL, NULL, 7, 1, 146),
(159, 'En forma Abstracta. Separando la esencia de las cualidades.', 0, 0, 'a', 0, NULL, NULL, NULL, NULL, 7, 1, 147),
(160, 'Observando', 0, 0, 'b', 19, NULL, NULL, NULL, NULL, 7, 1, 147),
(161, 'Concretamente', 0, 0, 'c', 0, NULL, NULL, NULL, NULL, 7, 1, 147),
(162, 'Activamente', 0, 0, 'd', 21, NULL, NULL, NULL, NULL, 7, 1, 147),
(163, 'OrientÃ¡ndome al Presente.', 0, 0, 'a', 18, NULL, NULL, NULL, NULL, 7, 1, 148),
(164, 'Reflexivamente. Considerando detenidamente.', 0, 0, 'b', 19, NULL, NULL, NULL, NULL, 7, 1, 148),
(165, 'OrientÃ¡ndome al futuro', 0, 0, 'c', 3, NULL, NULL, NULL, NULL, 7, 1, 148),
(166, 'PragmÃ¡ticamente. Buscando efectos prÃ¡cticos.', 0, 0, 'd', 21, NULL, NULL, NULL, NULL, 7, 1, 148),
(167, 'De la Experiencia.', 0, 0, 'a', 18, NULL, NULL, NULL, NULL, 7, 1, 149),
(168, 'De la observaciÃ³n.', 0, 0, 'b', 19, NULL, NULL, NULL, NULL, 7, 1, 149),
(169, 'De la conceptualizaciÃ³n.', 0, 0, 'c', 20, NULL, NULL, NULL, NULL, 7, 1, 149),
(170, 'De la experimentaciÃ³n.', 0, 0, 'd', 21, NULL, NULL, NULL, NULL, 7, 1, 149),
(171, 'Afectivamente. Siendo estimulado por las emociones.', 0, 0, 'a', 1, NULL, NULL, NULL, NULL, 7, 1, 150),
(172, 'Reservadamente. Con cautela y sin manifestaciÃ³n externa.', 0, 0, 'b', 19, NULL, NULL, NULL, NULL, 7, 1, 150),
(173, 'Racionalmente Discerniendo con la razÃ³n lo verdadero de lo falso.', 0, 0, 'c', 20, NULL, NULL, NULL, NULL, 7, 1, 150),
(174, 'Responsablemente. ObligÃ¡ndose a responder concretamente.', 0, 0, 'd', 21, NULL, NULL, NULL, NULL, 7, 1, 150),
(175, 'Casi nunca', 1, NULL, 'a', NULL, NULL, NULL, NULL, NULL, 3, 1, NULL),
(176, 'Raramente', 2, NULL, 'b', NULL, NULL, NULL, NULL, NULL, 3, 1, NULL),
(177, 'Ocasionalmente', 3, NULL, 'c', NULL, NULL, NULL, NULL, NULL, 3, 1, NULL),
(178, 'Frecuentemente', 4, NULL, 'd', NULL, NULL, NULL, NULL, NULL, 3, 1, NULL),
(179, 'Casi siempre', 5, NULL, 'e', NULL, NULL, NULL, NULL, NULL, 3, 1, NULL),
(180, 'Si', 0, NULL, 'a', NULL, NULL, NULL, NULL, NULL, 4, 1, NULL),
(181, 'No', 1, NULL, 'b', NULL, NULL, NULL, NULL, NULL, 4, 1, NULL),
(182, 'Totalmente en desacuerdo', 6, NULL, 'f', NULL, NULL, NULL, NULL, NULL, 5, 1, NULL),
(183, 'Más o menos en desacuerdo', 5, NULL, 'e', NULL, NULL, NULL, NULL, NULL, 5, 1, NULL),
(184, 'Ligeramente en desacuerdo', 4, NULL, 'd', NULL, NULL, NULL, NULL, NULL, 5, 1, NULL),
(185, 'Ligeramente de acuerdo', 3, NULL, 'c', NULL, NULL, NULL, NULL, NULL, 5, 1, NULL),
(186, 'Más o menos de acuerdo', 2, NULL, 'b', NULL, NULL, NULL, NULL, NULL, 5, 1, NULL),
(187, 'Totalmente de acuerdo', 1, NULL, 'a', NULL, NULL, NULL, NULL, NULL, 5, 1, NULL),
(188, 'Si', 1, NULL, 'b', NULL, NULL, NULL, NULL, NULL, 8, 1, NULL),
(189, 'No', 0, NULL, 'a', NULL, NULL, NULL, NULL, NULL, 8, 1, NULL),
(190, 'Casi nunca', 1, NULL, 'a', NULL, NULL, NULL, NULL, NULL, 9, 1, NULL),
(191, 'Raramente', 2, NULL, 'b', NULL, NULL, NULL, NULL, NULL, 9, 1, NULL),
(192, 'Ocasionalmente', 3, NULL, 'c', NULL, NULL, NULL, NULL, NULL, 9, 1, NULL),
(193, 'Frecuentemente', 4, NULL, 'd', NULL, NULL, NULL, NULL, NULL, 9, 1, NULL),
(194, 'Casi siempre', 5, NULL, 'e', NULL, NULL, NULL, NULL, NULL, 9, 1, NULL),
(195, 'Discreto(a)', NULL, NULL, NULL, NULL, 'Callado(a), prudente, reflexivo(a).', 'C', NULL, NULL, 10, 1, 201),
(196, 'Competitivo(a)', NULL, NULL, NULL, NULL, 'Ambicioso(a), le gusta ganar.', 'D', NULL, NULL, 10, 1, 201),
(197, 'Desenvuelto(a)', NULL, NULL, NULL, NULL, 'Extrovertido(a), actúa con soltura.', 'I', NULL, NULL, 10, 1, 201),
(198, 'Servicial', NULL, NULL, NULL, NULL, 'Dispuesto(a) a ayudar y brindar apoyo.', 'S', NULL, NULL, 10, 1, 201),
(199, 'Lógico(a)', NULL, NULL, NULL, NULL, 'Resuelve problemas aplicando el razonamiento lógico.', 'C', NULL, NULL, 10, 1, 202),
(200, 'Osado(a)', NULL, NULL, NULL, NULL, 'Asume riesgos con determinación y confianza.', 'D', NULL, NULL, 10, 1, 202),
(201, 'Flexible', NULL, NULL, NULL, NULL, 'Se amolda a las personas y a las circunstancias. Adaptable.', 'S', NULL, NULL, 10, 1, 202),
(202, 'Inspirador(a)', NULL, NULL, NULL, NULL, 'Motiva y anima a quienes lo rodean.', 'I', NULL, NULL, 10, 1, 202),
(203, 'Comunicativo(a)', NULL, NULL, NULL, NULL, 'Trasmite ideas y sentimientos con facilidad.', 'I', NULL, NULL, 10, 1, 203),
(204, 'Meticuloso(a)', NULL, NULL, NULL, NULL, 'Detallista, cuidadoso(a).', 'C', NULL, NULL, 10, 1, 203),
(205, 'Controlador(a)', NULL, NULL, NULL, NULL, 'Le gusta tener el control.', 'D', NULL, NULL, 10, 1, 203),
(206, 'Compasivo(a)', NULL, NULL, NULL, NULL, 'Sensible a los sentimientos y  emociones de los demás.', 'S', NULL, NULL, 10, 1, 203),
(207, 'Crítico(a)', NULL, NULL, NULL, NULL, 'Tiende a evaluar las cosas y las situaciones.', 'C', NULL, NULL, 10, 1, 204),
(208, 'Solidario(a)', NULL, NULL, NULL, NULL, 'Generoso(a). Dispuesto a compartir y ayudar a otros.', 'S', NULL, NULL, 10, 1, 204),
(209, 'Alegre', NULL, NULL, NULL, NULL, 'Generalmente está de buen humor. Divertido(a), jovial.', 'I', NULL, NULL, 10, 1, 204),
(210, 'Insistente', NULL, NULL, NULL, NULL, 'Insistente en lo que pide y en sus puntos de vista.', 'D', NULL, NULL, 10, 1, 204),
(211, 'Minucioso(a)', NULL, NULL, NULL, NULL, 'Meticuloso(a), cuida los detalles, riguroso(a).', 'C', NULL, NULL, 10, 1, 205),
(212, 'Respetuoso(a)', NULL, NULL, NULL, NULL, 'Cumplidor(a), respeta la autoridad.', 'S', NULL, NULL, 10, 1, 205),
(213, 'Tenaz', NULL, NULL, NULL, NULL, 'Actúa con decisión y determinación. No se da por vencido.', 'D', NULL, NULL, 10, 1, 205),
(214, 'Estimulante', NULL, NULL, NULL, NULL, 'Motivador(a), inspirador(a), energizante.', 'I', NULL, NULL, 10, 1, 205),
(215, 'Impetuoso(a)', NULL, NULL, NULL, NULL, 'Apasionado(a). Actúa con energía y rapidez, guiado(a) por sus instintos.', 'I', NULL, NULL, 10, 1, 206),
(216, 'Perfeccionista', NULL, NULL, NULL, NULL, 'Meticuloso(a), detallista, minucioso(a), busca la calidad.', 'C', NULL, NULL, 10, 1, 206),
(217, 'Exigente', NULL, NULL, NULL, NULL, 'Demandante con los demás.', 'D', NULL, NULL, 10, 1, 206),
(218, 'Calmado(a)', NULL, NULL, NULL, NULL, 'Tranquilo(a), sereno(a), relajado(a).', 'S', NULL, NULL, 10, 1, 206),
(219, 'Encantador(a)', NULL, NULL, NULL, NULL, 'Carismático(a), atrae a los demás.', 'I', NULL, NULL, 10, 1, 207),
(220, 'Satisfecho(a)', NULL, NULL, NULL, NULL, 'Por lo general está de buen humor y a gusto con la vida.', 'S', NULL, NULL, 10, 1, 207),
(221, 'Dominante', NULL, NULL, NULL, NULL, 'De carácter fuerte, le gusta tener el control.', 'D', NULL, NULL, 10, 1, 207),
(222, 'Correcto(a)', NULL, NULL, NULL, NULL, 'Sigue las normas y los procedimientos establecidos.', 'C', NULL, NULL, 10, 1, 207),
(223, 'Confrontativo(a)', NULL, NULL, NULL, NULL, 'No tiene problema en expresar su punto de vista o desacuerdo.', 'D', NULL, NULL, 10, 1, 208),
(224, 'Estructurado(a)', NULL, NULL, NULL, NULL, 'Ordenado(a), metódico(a).', 'C', NULL, NULL, 10, 1, 208),
(225, 'Considerado(a)', NULL, NULL, NULL, NULL, 'Atento(a), educado(a). Evita causar inconvenientes.', 'S', NULL, NULL, 10, 1, 208),
(226, 'Espontáneo(a)', NULL, NULL, NULL, NULL, 'Desinhibido(a), auténtico(a), natural.', 'I', NULL, NULL, 10, 1, 208),
(227, 'Impaciente', NULL, NULL, NULL, NULL, 'No le gusta esperar, no se relaja fácilmente.', 'D', NULL, NULL, 10, 1, 209),
(228, 'Cordial', NULL, NULL, NULL, NULL, 'Amable, cercano(a), dispuesto a ayudar.', 'S', NULL, NULL, 10, 1, 209),
(229, 'Convincente', NULL, NULL, NULL, NULL, 'Expresivo(a) y persuasivo(a)', 'I', NULL, NULL, 10, 1, 209),
(230, 'Cauto(a)', NULL, NULL, NULL, NULL, 'Actúa con precaución. Es cauteloso(a) ante el peligro.', 'C', NULL, NULL, 10, 1, 209),
(231, 'Leal', NULL, NULL, NULL, NULL, 'Fiel a sus valores y a las personas importantes en su vida.', 'S', NULL, NULL, 10, 1, 210),
(232, 'Decidido(a)', NULL, NULL, NULL, NULL, 'Determinado(a), firme, seguro(a)', 'D', NULL, NULL, 10, 1, 210),
(233, 'Precavido(a)', NULL, NULL, NULL, NULL, 'Piensa con anticipación para evitar conratiempos. Cauteloso(a).', 'C', NULL, NULL, 10, 1, 210),
(234, 'Dinámico(a)', NULL, NULL, NULL, NULL, 'Energético(a), vivaz, animado(a), entusiasta.', 'I', NULL, NULL, 10, 1, 210),
(235, 'Simpático(a)', NULL, NULL, NULL, NULL, 'Sociable, agradable, muestra interés por los demás.', 'I', NULL, NULL, 10, 1, 211),
(236, 'Riguroso(a)', NULL, NULL, NULL, NULL, 'Preciso(a), minucioso(a), exacto(a)', 'C', NULL, NULL, 10, 1, 211),
(237, 'Directo(a)', NULL, NULL, NULL, NULL, 'No tiene problema en decir lo que piensa.', 'D', NULL, NULL, 10, 1, 211),
(238, 'Sereno(a)', NULL, NULL, NULL, NULL, 'Mantiene la calma, tranquilo(a), relajado(a).', 'S', NULL, NULL, 10, 1, 211),
(239, 'Intrépido(a)', NULL, NULL, NULL, NULL, 'Muestra valentía en situaciones difíciles. No teme resolver problemas.', 'D', NULL, NULL, 10, 1, 212),
(240, 'Entusiasta', NULL, NULL, NULL, NULL, 'Vivaz, alegre, estimulante. Motiva a los demás.', 'I', NULL, NULL, 10, 1, 212),
(241, 'Constante', NULL, NULL, NULL, NULL, 'Capaz de matener el ritmo para lograr algo o hacerlo mejor.', 'S', NULL, NULL, 10, 1, 212),
(242, 'Prolijo(a)', NULL, NULL, NULL, NULL, 'Minucioso(a), detallista, se enfoca en la calidad y los detalles.', 'C', NULL, NULL, 10, 1, 212),
(243, 'Influyente', NULL, NULL, NULL, NULL, 'Motiva a los demás a hacer algo; estimulante, alentador.', 'I', NULL, NULL, 10, 1, 213),
(244, 'Apresurado(a)', NULL, NULL, NULL, NULL, 'Hace las cosas con rapidez y le gusta que los otros actúen igual.', 'D', NULL, NULL, 10, 1, 213),
(245, 'Analítico(a)', NULL, NULL, NULL, NULL, 'Razonador(a), lógico(a), reflexivo(a).', 'C', NULL, NULL, 10, 1, 213),
(246, 'Afable', NULL, NULL, NULL, NULL, 'Agradable; suave de trato y de buen humor.', 'S', NULL, NULL, 10, 1, 213),
(247, 'Accesible', NULL, NULL, NULL, NULL, 'Sociable, abierto(a), agradable.', 'I', NULL, NULL, 10, 1, 214),
(248, 'Empático(a)', NULL, NULL, NULL, NULL, 'Escucha y comprende a los demás.', 'S', NULL, NULL, 10, 1, 214),
(249, 'Prevenido(a)', NULL, NULL, NULL, NULL, 'Prudente, precavido(a), cauteloso(a).', 'C', NULL, NULL, 10, 1, 214),
(250, 'Franco(a)', NULL, NULL, NULL, NULL, 'Directo(a). Se expresa sin rodeos.', 'D', NULL, NULL, 10, 1, 214),
(251, 'Cálido(a)', NULL, NULL, NULL, NULL, 'Agradable, cercano(a) y placentero(a) en su trato.', 'S', NULL, NULL, 10, 1, 215),
(252, 'Creativo(a)', NULL, NULL, NULL, NULL, 'Capacidad para crear. Ingenioso(a), imaginativo(a).', 'I', NULL, NULL, 10, 1, 215),
(253, 'Objetivo(a)', NULL, NULL, NULL, NULL, 'Analiza las situaciones de manera lógica y descriptiva.', 'C', NULL, NULL, 10, 1, 215),
(254, 'Arriesgado', NULL, NULL, NULL, NULL, 'Toma riesgos. Es audaz.', 'D', NULL, NULL, 10, 1, 215),
(255, 'Motivador(a)', NULL, NULL, NULL, NULL, 'Inspira a otros a actuar y mantenerse activos.', 'I', NULL, NULL, 10, 1, 216),
(256, 'Amable', NULL, NULL, NULL, NULL, 'Gentil, cordial.', 'S', NULL, NULL, 10, 1, 216),
(257, 'Perspicaz', NULL, NULL, NULL, NULL, 'Capta detalles que otros no ven. Observador(a) y sagaz.', 'C', NULL, NULL, 10, 1, 216),
(258, 'Autosuficiente', NULL, NULL, NULL, NULL, 'Independiente, sigue su propio camino, sin depender de otros.', 'D', NULL, NULL, 10, 1, 216),
(259, 'Carismático(a)', NULL, NULL, NULL, NULL, 'Simpático(a), jovial, contagia buen humor.', 'I', NULL, NULL, 10, 1, 217),
(260, 'Organizado(a)', NULL, NULL, NULL, NULL, 'Ordenado(a), preciso(a), respetuoso(a) de las reglas.', 'C', NULL, NULL, 10, 1, 217),
(261, 'Pionero(a)', NULL, NULL, NULL, NULL, 'Le gusta ir al frente, abrir caminos, asumir el liderazgo.', 'D', NULL, NULL, 10, 1, 217),
(262, 'Moderado(a)', NULL, NULL, NULL, NULL, 'Mantiene el equilibrio emocional. Calmado(a) y sereno(a).', 'S', NULL, NULL, 10, 1, 217),
(263, 'Sociable', NULL, NULL, NULL, NULL, 'Disfruta interactuar con los demás. Hace amigos fácilmente.', 'I', NULL, NULL, 10, 1, 218),
(264, 'Cauteloso(a)', NULL, NULL, NULL, NULL, 'Precavido(a), cuidadoso(a), actúa con cautela.', 'C', NULL, NULL, 10, 1, 218),
(265, 'Apacible', NULL, NULL, NULL, NULL, 'Tranquilo(a). Busca la armonía y evita los conflictos.', 'S', NULL, NULL, 10, 1, 218),
(266, 'Intenso(a)', NULL, NULL, NULL, NULL, 'Impaciente e insistente en lo que busca.', 'D', NULL, NULL, 10, 1, 218),
(267, 'Diplomático(a)', NULL, NULL, NULL, NULL, 'Prudente, reservado(a), discreto(a)', 'C', NULL, NULL, 10, 1, 219),
(268, 'Atento(a)', NULL, NULL, NULL, NULL, 'Agradable y complaciente con los demás.', 'S', NULL, NULL, 10, 1, 219),
(269, 'Atrayente', NULL, NULL, NULL, NULL, 'Carismático(a), encantador(a), atrae a los demás', 'I', NULL, NULL, 10, 1, 219),
(270, 'Persistente', NULL, NULL, NULL, NULL, 'Tenaz, insistente, no renuncia fácilmente.', 'D', NULL, NULL, 10, 1, 219),
(271, 'Magnético(a)', NULL, NULL, NULL, NULL, 'Sociable, encantador(a), atrae a otros por su forma de ser.', 'I', NULL, NULL, 10, 1, 220),
(272, 'Introspectivo(a)', NULL, NULL, NULL, NULL, 'Profundiza y analiza sus propios pensamientos.', 'C', NULL, NULL, 10, 1, 220),
(273, 'Resuelto(a)', NULL, NULL, NULL, NULL, 'Determinado(a), decidido(a), decisiones firmes.', 'D', NULL, NULL, 10, 1, 220),
(274, 'Tranquilo', NULL, NULL, NULL, NULL, 'Proyecta calma, serenidad y armonía.', 'S', NULL, NULL, 10, 1, 220),
(275, 'Extrovertido(a)', NULL, NULL, NULL, NULL, 'Es sociable. Comparte pensamientos y emociones con facilidad.', 'I', NULL, NULL, 10, 1, 221),
(276, 'Tolerante', NULL, NULL, NULL, NULL, 'Muestra apertura a diferentes opiniones y prácticas.', 'S', NULL, NULL, 10, 1, 221),
(277, 'Autónomo(a)', NULL, NULL, NULL, NULL, 'Autosuficiente. Confía en sí mismo y en sus capacidades.', 'D', NULL, NULL, 10, 1, 221),
(278, 'Preciso(a)', NULL, NULL, NULL, NULL, 'Busca precisión y calidad en sus acciones y afirmaciones.', 'C', NULL, NULL, 10, 1, 221),
(279, 'Discreto(a)', NULL, NULL, NULL, NULL, 'Reservado(a), prudente, piensa antes de hablar.', 'C', NULL, NULL, 10, 1, 222),
(280, 'Colaborador(a)', NULL, NULL, NULL, NULL, 'Dispuesto(a) a brindar apoyo a los demás.', 'S', NULL, NULL, 10, 1, 222),
(281, 'Implacable', NULL, NULL, NULL, NULL, 'Afronta los obstáculos con decisión. Se rehusa a renunciar.', 'D', NULL, NULL, 10, 1, 222),
(282, 'Animado(a)', NULL, NULL, NULL, NULL, 'Dinámico(a), divertido(a), usa gestos para expresarse.', 'I', NULL, NULL, 10, 1, 222),
(283, 'Enérgico(a)', NULL, NULL, NULL, NULL, 'Decidido y audaz en la búsqueda de resultados.', 'D', NULL, NULL, 10, 1, 223),
(284, 'Impulsivo(a)', NULL, NULL, NULL, NULL, 'Precipitado(a), espontáneo(a).', 'I', NULL, NULL, 10, 1, 223),
(285, 'Placentero(a)', NULL, NULL, NULL, NULL, 'Agradable y cercano(a) con las personas que lo rodean.', 'S', NULL, NULL, 10, 1, 223),
(286, 'Racional', NULL, NULL, NULL, NULL, 'Analiza y discierne lo que pasa a su alrededor.', 'C', NULL, NULL, 10, 1, 223),
(287, 'Expresivo(a)', NULL, NULL, NULL, NULL, 'Comunica sus pensamientos de manera verbal y no verbal.', 'I', NULL, NULL, 10, 1, 224),
(288, 'Reservado(a)', NULL, NULL, NULL, NULL, 'Expresa poco sus pensamientos, emociones y sentimientos.', 'C', NULL, NULL, 10, 1, 224),
(289, 'Paciente', NULL, NULL, NULL, NULL, 'Tiene la capacidad de esperar con calma.', 'S', NULL, NULL, 10, 1, 224),
(290, 'Resolutivo(a)', NULL, NULL, NULL, NULL, 'Toma decisiones de manera rápida.', 'D', NULL, NULL, 10, 1, 224),
(291, 'Audaz', NULL, NULL, NULL, NULL, 'Distpuesto(a) a asumir desafíos. Osado(a), atrevido(a)', 'D', NULL, NULL, 10, 1, 225),
(292, 'Razonador(a)', NULL, NULL, NULL, NULL, 'Analiza las situaciones con profundidad y detalle.', 'C', NULL, NULL, 10, 1, 225),
(293, 'Persuasivo(a)', NULL, NULL, NULL, NULL, 'Encantador(a), ameno(a), comunicativo(a).', 'I', NULL, NULL, 10, 1, 225),
(294, 'Equilibrado(a)', NULL, NULL, NULL, NULL, 'Moderado(a), prudente, evita los extremos.', 'S', NULL, NULL, 10, 1, 225),
(295, 'Ambicioso(a)', NULL, NULL, NULL, NULL, 'Le gusta ir más allá. Competitivo(a), emprendedor(a).', 'D', NULL, NULL, 10, 1, 226),
(296, 'Gentil', NULL, NULL, NULL, NULL, 'Atento(a), amable, considerado(a)', 'S', NULL, NULL, 10, 1, 226),
(297, 'Jovial', NULL, NULL, NULL, NULL, 'Alegre, divertido(a). Generalmente está de buen humor.', 'I', NULL, NULL, 10, 1, 226),
(298, 'Perceptivo(a)', NULL, NULL, NULL, NULL, 'Capta y discierne lo que pasa a su alrededor.', 'C', NULL, NULL, 10, 1, 226),
(299, 'Prudente', NULL, NULL, NULL, NULL, 'Precavido(a), mide los riesgos, evita el peligro.', 'C', NULL, NULL, 10, 1, 227),
(300, 'Determinado(a)', NULL, NULL, NULL, NULL, 'Seguro(a), decidido(a), firme en sus decisiones.', 'D', NULL, NULL, 10, 1, 227),
(301, 'Conversador(a)', NULL, NULL, NULL, NULL, 'Sociable, abierto(a), locuaz.', 'I', NULL, NULL, 10, 1, 227),
(302, 'Agradable', NULL, NULL, NULL, NULL, 'Amable, placentero(a), bondadoso(a).', 'S', NULL, NULL, 10, 1, 227),
(303, 'Elocuente', NULL, NULL, NULL, NULL, 'Socializa fácilmente con todo tipo de personas.', 'I', NULL, NULL, 10, 1, 228),
(304, 'Metódico(a)', NULL, NULL, NULL, NULL, 'Organizado(a), planificado(a), sistemático(a).', 'C', NULL, NULL, 10, 1, 228),
(305, 'Firme', NULL, NULL, NULL, NULL, 'Actúa con coraje, energía y determinación', 'D', NULL, NULL, 10, 1, 228),
(306, 'Comprensivo(a)', NULL, NULL, NULL, NULL, 'Tolerante e indulgente con las acciones de otros.', 'S', NULL, NULL, 10, 1, 228);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `atributo`
--

CREATE TABLE `atributo` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `atributo` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `herramienta_usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `entidad_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `biblioteca`
--

CREATE TABLE `biblioteca` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` varchar(255) NOT NULL,
  `ruta_archivo` text DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT 1,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calculo_tabla_resultados`
--

CREATE TABLE `calculo_tabla_resultados` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `puntaje` int(11) DEFAULT NULL,
  `resultado` varchar(255) DEFAULT NULL,
  `iresultado` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dimension_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'Estudios', '2026-04-06 22:46:35', '2026-04-06 22:46:35'),
(2, 'Artículos', '2026-04-06 22:46:35', '2026-04-06 22:46:35'),
(3, 'Resumenes de libros', '2026-04-06 22:46:35', '2026-04-06 22:46:35'),
(4, 'Lecturas', '2026-04-06 22:46:35', '2026-04-06 22:46:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_respuesta`
--

CREATE TABLE `detalle_respuesta` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resultado` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `respuesta_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `alternativa_id` bigint(20) UNSIGNED DEFAULT NULL,
  `pregunta_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dimension`
--

CREATE TABLE `dimension` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dimension` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `descripcion_larga` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `dimension`
--

INSERT INTO `dimension` (`id`, `dimension`, `descripcion`, `descripcion_larga`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Formación', 'Fase de iniciación del equipo.', 'El equipo del proyecto está inicialmente preocupado con su orientación, la cual se logra a través de evaluaciones. Esas evaluaciones sirven para identificar los límites de los comportamientos interpersonales y de la tarea. Coincidente con la prueba en el ámbito interpersonal es el establecimiento de las relaciones de dependencia con los líderes, con los otros miembros del grupo, o con los estándares preexistentes.\nLos miembros del equipo se comportan de forma independiente. Pueden ser motivados pero generalmente están relativamente mal informados sobre los temas y los objetivos del equipo. Algunos miembros del equipo pueden exhibir muestras de incertidumbre y de ansiedad.\nEl Líder del proyecto debe mantener al equipo junto, asegurándose de confíen el uno en el otro y en que tengan la capacidad de  desarrollar una relación de trabajo.\nEstilo: Director o “informar”. Compartir el concepto de la “Formación, Enfrentamientos, Normalización, Desempeño\" con el equipo puede ser provechoso.', NULL, NULL, 1),
(2, 'Enfrentamientos.', 'Las diferentes ideas compiten, a menudo ferozmente, para que se les tome en cuenta.', 'El equipo de proyecto gana confianza, pero hay conflictos y polarización alrededor de temas interpersonales\nLos miembros del equipo están mostrando sus propias personalidades mientras que enfrentan ideas y perspectivas de cada uno de los otros miembros. La frustración o los desacuerdos sobre metas, expectativas, papeles y responsabilidades se expresan abiertamente.\nEl Líder del proyecto conduce al equipo de proyecto a través de ésta fase turbulenta de transición.\nEstilo:  Entrenador. La tolerancia de cada miembro del equipo y en sus diferentes necesidades debe ser acentuada.', NULL, NULL, 1),
(3, 'Normalización.', 'Se están estableciendo las reglas, valores, comportamiento, métodos y herramientas.', 'La eficacia del equipo de proyecto aumenta y el equipo comienza a desarrollar una identidad.\nLos miembros del equipo ajustan su comportamiento el uno al del otro mientras que desarrollan acuerdos de hacer el trabajo en equipo de forma más natural y fluida. Esfuerzo consciente de resolver los problemas y de lograr armonía en el grupo. Los niveles de motivación están aumentando.\nEl Líder de proyecto permite que el equipo se haga mucho más autónomo.\nEstilo Participativo.', NULL, NULL, 1),
(4, 'Desempeño.', 'La estructura interpersonal se convierte en la herramienta de las actividades de la tarea.\nLos papeles llegan a ser flexibles y funcionales, y la energía del grupo se encausa hacia la tarea.', 'El equipo de proyecto puede ahora funcionar como una unidad. Consigue que el trabajo sea hecho de forma fluida y con eficacia, sin conflictos inadecuados o necesidad de supervisión externa.\nLos miembros del equipo tienen una comprensión clara sobre lo qué se requiere de él a nivel de tarea. Ellos son ahora competentes, autónomos y ahora manejan el procedimiento de la toma de decisiones sin supervisión. La actitud \"Yo puede hacerlo” es visible. Se hacen ofertas espontáneas para ayudar a otros.\nEl Líder del proyecto permite al equipo tomar la mayor parte de las decisiones necesarias.\nEstilo delegativo.', NULL, NULL, 1),
(5, 'Escuchar sin interrumpir.', NULL, NULL, NULL, NULL, 1),
(6, 'Escuchar prestando 100% de atención.', NULL, NULL, NULL, NULL, 1),
(7, 'Escuchar más allá de las palabras.', NULL, NULL, NULL, NULL, 1),
(8, 'Escuchar incentivando al otro a profundizar.', NULL, NULL, NULL, NULL, 1),
(9, 'Dirigir\nAlta Tarea - Baja Relación', 'Comportamiento alto en dirección y bajo en apoyo', NULL, NULL, NULL, 1),
(10, 'Entrenar\nAlta Tarea - Alta Relación', 'Comportamiento alto en dirección y alto en apoyo', NULL, NULL, NULL, 1),
(11, 'Apoyar\nBaja Tarea - Alta Relación', 'Comportamiento bajo en dirección y alto en apoyo', NULL, NULL, NULL, 1),
(12, 'Baja Tarea - Baja Relación', 'Delegar', 'Comportamiento bajo en dirección y bajo en apoyo', NULL, NULL, 1),
(13, 'COMPETIR', '1. Cuando es de vital importancia una acción rápida y decidida, por ejemplo, una emergencia.\n2. En problemas importantes en donde debe implementarse alguna acción impopular, por ejemplo, reducción de costo, aplicación de reglamentos desagradables, disciplina.\n3. En asuntos vitales para el bienestar de la compañía cuando usted sabe que tiene razón.\n4. Para protegerse a usted mismo contra personas que se aprovechan deL comportamiento no-competitivo.', NULL, NULL, NULL, 1),
(14, 'COLABORAR', '1. Encontrar una solución integral, cuando los intereses de ambas son demasiado importantes como para transigir.\n2. Cuando su objetivo es aprender por ejemplo, probando sus propios supuestos, comprendiendo el punto de vista de los demás.\n3. Tomar las ideas de varias personas con diferentes perspectivas para solucionar un problema.\n4. Obtener el compromiso de los demás incorporando sus intereses en una decisión consensual.\n5. Trabajar para superar resentimientos que hayan estado interfiriendo con una relación interpersonal.', NULL, NULL, NULL, 1),
(15, 'COMPROMETER', '1. Cuando las metas son moderadamente importantes pero no vale el esfuerzo o la posible alteración de algunos estilos afirmativos.\n2. Cuando dos oponentes con igual poder están firmemente comprometidos a metas mutuamente excluyentes como en las negaciones sindicales.\n3. Para obtener un arreglo temporal a problemas complejos.\n4. Para llegar a soluciones rápidas cuando existen presiones de tiempo.\n5. Cuando la colaboración no tiene éxito.', NULL, NULL, NULL, 1),
(16, 'EVADIR', '1. Cuando un problema es trivial o de importancia solamente pasajera, o cuando otros asuntos más importantes están presionando.\n2. Cuando no percibe probabilidad de satisfacer sus intereses, cuando tiene poco poder o se siente frustrado por asuntos o circunstancias que sería muy difícil de cambiar (políticas nacionales de otra persona, etc.).\n3. Cuando el daño potencial de confrontar un conflicto excede a los beneficios de su solución.\n4. Para dejar que la gente se calme, para reducir tensiones hasta un nivel productivo y para recuperar la perspectiva y ecuanimidad.\n5. Cuando la recopilación de la información excede a las ventajas de tomar una decisión inmediata.\n6. Cuando otro puede resolver el conflicto más efectivamente.\n7. Cuando el problema parezca periférico o sintomático de otro problema más básico.', NULL, NULL, NULL, 1),
(17, 'COMPLACER', '1. Cuando comprende usted que está equivocado, para permitir que se escuche una mejor opinión, para aprender de los demás y para mostrar que es usted razonable.\n2. Cuando el asunto es mucho más importante para la otra persona que para usted, para satisfacer las necesidades de los demás, y como un gesto de buena voluntad para ayudar a mantener una relación de cooperación.\n3. Para acumular créditos sociales para problemas posteriores que sean importantes para usted.\n4. Cuando una competencia continua solamente dañaría su causa, cuando su oponente es superior y usted está perdiendo.\n5. Cuando sea especialmente importante conservar la armonía y evitar rupturas.\n6. Para ayudar en el desarrollo administrativo de los subordinados permitiéndoles que experimenten y que aprendan de sus errores.', NULL, NULL, NULL, 1),
(18, 'Experiencia Concreta (EC)', 'Refleja una tendencia a aprender basado en la experiencia y en juicios intuitivos.\nLos individuos con un fuerte desarrollo en EC suelen establecer buenos contactos con otros y son más bien “orientados a las personas”.\n A menudo encuentran que la teoría no ayuda mucho y prefieren tratar cada caso como caso único.\nAprenden más de ejemplos específicos que los enfrentan a situaciones prácticas.\nLas personas que enfatizan EC aprenden más de sus iguales que de sus superiores y se benefician más de la retroalimentación y discusión con los otros que enfatizan EC.', NULL, NULL, NULL, 1),
(19, 'Observación Reflexiva (OR)', 'Refleja una tendencia a aprender en forma imparcial y reflexiva.\nLas personas con un desarrollo de OR aprenden basándose en juicios sobre observaciones precisas y prefieren\n situaciones de aprendizaje tal como las clases expositivas que les permiten tomar el rol de observadores imparciales.\nEstas personas suelen ser Introvertidas.', NULL, NULL, NULL, 1),
(20, 'Conceptualización Abstracta (CA)', 'Refleja una tendencia al análisis y a la conceptualización y una forma de aprender basada en el pensamiento lógico y la evaluación racional.\nLas personas con un fuerte desarrollo de CA tienden a orientarse más hacia las cosas y los símbolos que hacia otras personas.\nAprende más en situaciones impersonales con una clara autoridad en las que enfatiza el análisis sistemático y la teoría.\nSe frustran y obtienen poco beneficio de la experiencia poco estructurada tales como el ejercicio y la simulación.', NULL, NULL, NULL, 1),
(21, 'Experimentación Activa (EA)', 'Refleja una tendencia a aprender haciendo cosas y experimentando alternativas.\nLas personas con un grado de desarrollo de EA aprenden más cuando participan en proyectos, trabajos o discusión de grupo.\nNo se sienten atraídos por clases expositivas y situaciones de aprendizaje pasivo. Estas personas suelen ser extravertidas.', NULL, NULL, NULL, 1),
(22, 'Confianza', 'Seguridad que tienen los miembros del equipo sobre que las intenciones de sus compañeros son buenas,\ny sobre que no hay razón para ser ni protector ni cauteloso. Implica que los miembros de un equipo se sienten verdaderamente\ncómodos si están expuestos unos a otros, y actúan sin preocuparse de protegerse a sí mismo por lo que dicen o lo que hacen.\nEl resultado es que pueden centrar su energía en el trabajo', NULL, NULL, NULL, 1),
(23, 'Confrontación o Capacidad\nde enfrentar el conflicto', 'Implica que el equipo busca resolver problemas, aunque esto implica salir acalorados del debate,\npero sin resentimientos o daños colaterales.', NULL, NULL, NULL, 1),
(24, 'Compromiso', 'Los grandes equipos adoptan decisiones claras y permanentes y las concretan con la aceptación de los otros miembros\ndel equipo, incluso quienes en un principio no estaban de acuerdo', NULL, NULL, NULL, 1),
(25, 'Rendición de Cuentas', 'El equipo tiende a ser menos “políticamente correcto” y se atreven a entregarse feedback entre pares', NULL, NULL, NULL, 1),
(26, 'Resultados', 'Implica que el equipo se centra en los objetivos compartidos, no solo en los objetivos de su área', NULL, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disc_analisis`
--

CREATE TABLE `disc_analisis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `meta` text DEFAULT NULL,
  `juzga` text DEFAULT NULL,
  `emociones` text DEFAULT NULL,
  `seria` text DEFAULT NULL,
  `bajopresion` text DEFAULT NULL,
  `influye` text DEFAULT NULL,
  `teme` text DEFAULT NULL,
  `dominancia` text DEFAULT NULL,
  `abusa` text DEFAULT NULL,
  `nombre_patron` text DEFAULT NULL,
  `regla` text DEFAULT NULL,
  `suvalor` text DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disc_codigo`
--

CREATE TABLE `disc_codigo` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `letra` text DEFAULT NULL,
  `segmento` text DEFAULT NULL,
  `intensidad` int(11) DEFAULT NULL,
  `rango_min` int(11) DEFAULT NULL,
  `rango_max` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `disc_instancia`
--

CREATE TABLE `disc_instancia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo_patron` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `disc_analisis_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `empresa` varchar(255) DEFAULT NULL,
  `razonsocial` varchar(255) DEFAULT NULL,
  `numero_identificacion_fiscal` varchar(255) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `telefonos` varchar(255) DEFAULT NULL,
  `pagina_web` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id`, `empresa`, `razonsocial`, `numero_identificacion_fiscal`, `direccion`, `telefonos`, `pagina_web`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Empresa Demo', 'Demo S.A.', '12345678-9', NULL, NULL, NULL, '2026-04-06 22:46:34', '2026-04-06 22:46:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entidad`
--

CREATE TABLE `entidad` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tipo_entidad` text DEFAULT NULL,
  `entidad` varchar(255) DEFAULT NULL,
  `codigo_metodo` varchar(255) DEFAULT NULL,
  `sub_entidad` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `entidad`
--

INSERT INTO `entidad` (`id`, `tipo_entidad`, `entidad`, `codigo_metodo`, `sub_entidad`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Freno', 'DEFENDER', 'Defender', 'LO QUE SI QUIERO Y SI TENGO', NULL, NULL, 1),
(2, 'Motor', 'DESECHAR', 'Desechar', 'LO QUE NO QUIERO Y SI TENGO', NULL, NULL, 1),
(3, 'Motor', 'OBTENER', 'Obtener', 'LO QUE SI QUIERO Y NO TENGO', NULL, NULL, 1),
(4, 'Freno', 'EVITAR', 'Evitar', 'LO QUE NO QUIERO Y NO TENGO', NULL, NULL, 1),
(5, 'Hoy', 'FORTALEZAS', 'Fortalezas', '¿Qué debería conservar?', NULL, NULL, 1),
(6, 'Futuro', 'Aspiraciones', 'Aspiraciones', '¿Con qué sueñas, la mejor versión?', NULL, NULL, 1),
(7, 'Hoy', 'Oportunidades', 'Oportunidades', '¿Cómo aprovecho oportunidades hoy?', NULL, NULL, 1),
(8, 'Futuro', 'Resultados', 'Resultados', '¿Cómo sabrás que estás tiendo exito?', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`id`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'Activo', '2026-04-06 22:46:34', '2026-04-06 22:46:34'),
(2, 'Inactivo', '2026-04-06 22:46:34', '2026-04-06 22:46:34'),
(3, 'En proceso', '2026-04-06 22:46:34', '2026-04-06 22:46:34'),
(4, 'Finalizada', '2026-04-06 22:46:34', '2026-04-06 22:46:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion`
--

CREATE TABLE `evaluacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nro_alternativas` int(11) DEFAULT NULL,
  `nombre` text DEFAULT NULL,
  `interpretacion` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `dimensiones` int(11) DEFAULT NULL,
  `resultado` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `instrucciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `tipo_evaluacion_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluacion`
--

INSERT INTO `evaluacion` (`id`, `nro_alternativas`, `nombre`, `interpretacion`, `foto`, `dimensiones`, `resultado`, `descripcion`, `instrucciones`, `created_at`, `updated_at`, `estado_id`, `tipo_evaluacion_id`) VALUES
(1, 4, 'Liderazgo Situacional', NULL, 'liderazgo_situacional.jpg', 1, '1', 'Ser líder situacional significa ser capaz de analizar la situación y modificar tu estilo de liderazgo según lo requiere cada momento. En este test descubrimos las bases del liderazgo situacional y cómo se aplican en tu empresa para mejorar el ambiente de trabajo.', 'texto', NULL, NULL, 1, 1),
(2, 3, 'Test de Asertividad', NULL, 'asertividad.jpeg', 0, '0', 'El concepto de asertividad hace referencia a la capacidad de comunicar a las personas que nos rodean nuestros sentimientos y necesidades pero evitando herir y ofender a los demás.', 'texto', NULL, NULL, 1, 1),
(3, 5, 'Etapas de desarrollo del equipo', 'El más alto de los cuatro puntajes acumulados indica qué etapa se percibe como en la que su equipo opera normalmente.\n\nSi su puntaje acumulado más alto es 29 o más, es un indicador muy fuerte de la etapa en que su equipo está operando.\n\nSi el puntaje acumulado está entre 19 y 28 puntos, es un indicador de que su equipo  opera eventualmente de esta forma.\n\nEl puntaje acumulado más bajo de los cuatro es un indicador de la etapa que menos identifica a su equipo. Si su puntaje acumulado es 18 o menos, es un indicador muy fuerte de que su equipo no opera de esta forma.\n\nSi dos de los puntajes están muy cerca, su equipo está probablemente pasando por un período de transición, a menos que:\n\nSi tiene puntajes acumulados altos en las etapas de Formación y Confrontación su equipo está en la etapa de Confrontación.\n\nSi tiene puntajes acumulados altos en las etapas de Normalización y Desempeño su equipo está en la etapa de Desempeño.\n\nSi solamente hay una pequeña diferencia entre tres o cuatro puntajes acumulados, entonces es indicador de que no se tiene una percepción clara de la forma en que el equipo está operando, la operación del equipo es muy variable. Por otro lado puede ser indicador de que el equipo está en la etapa de Confrontación (esta etapa puede ser extremadamente volátil y obtener puntajes algunas veces altos y algunas veces bajos).\n\n\nConfiabilidad y de Validación\nEste cuestionario es una herramienta de entrenamiento, no ha sido evaluado formalmente como herramienta estadística. Sin embargo, el autor considera que la cantidad de veces que ha sido utilizado y la retroalimentación positiva que ha obtenido, la herramienta es muy provechosa.', 'etapas.jpg', 1, '0', 'Tuckman define las 4 etapas a las que un grupo necesita enfrentase y superar con éxito aquello que quiere ser, un equipo de alto rendimiento.', 'texto', NULL, NULL, 1, 1),
(4, 2, 'Test de Escucha Activa', NULL, 'escucha_activa.png', 1, '0', 'Este tipo de escucha te ayuda a desarrollar relaciones sólidas, a comprender a tus amigos y colegas de manera más profunda e incluso a profundizar tu propio sentido de la empatía.', 'texto', NULL, NULL, 1, 1),
(5, 6, 'Test de Felicidad', NULL, 'felicidad.jpg', 0, '1', 'La felicidad se entiende como un estado de ánimo positivo. Dicho estado de ánimo es subjetivo y, por tanto, no se refiere a un hecho autopercibido. Esto implica que una misma serie de hechos puede ser percibido de manera diferente por personas con diferentes temperamentos, y por tanto lo que para una persona puede ser una situación feliz para otra puede llevar aparejada insatisfacción e incluso frustración.', 'texto', NULL, NULL, 1, 1),
(6, 2, 'Manejo de Conflictos', '<h1>COMPETIR</h1>\n<p>\nEs ser afirmativo y no cooperar. Cuando la persona trata de satisfacer sus propios intereses a costa de la otra persona. Este es un estilo orientado al poder, en el que la persona usa cualquier tipo de poder que le parezca apropiado para ganar su postura, su habilidad de argumentar, su rango, sus sanciones económicas.\n</p>\n<h1>COMPLACER</h1>\n<p>\nEs lo opuesto de competir no ser afirmativo y ser cooperador. Al complacer, la persona se olvida de sus propios intereses para satisfacer los intereses de otras personas; existe un elemento de sacrificio en este estilo. El complacer puede tomar la forma de una generosidad desinteresada o caritativa, obedeciendo las órdenes de la otra persona cuando preferiría no hacerlo, o cediendo al punto de vista de los demás.\n</p>\n<h1>EVADIR</h1>\n<p>\nAl evadir, se renuncia a ser afirmativo y también a cooperar. No se maneja el conflicto y la evasión puede significar sacarle la vuelta diplomáticamente a un problema, posponiéndolo hasta un momento más adecuado o simplemente retirarse de una situación amenazadora.\n</p>\n<h1>COLABORAR</h1>\n<p>\nSignifica ser tanto afirmativo como cooperador. Lo opuesto de la evasión. Colaborar implica un intento de trabajar con la otra persona para encontrar alguna solución que satisfaga plenamente los intereses de ambas personas. Significa profundizar en un problema con el fin de identificar los intereses subyacentes de las dos personas y encontrar una alternativa que satisfaga los intereses de ambos.\nLa colaboración entre dos personas puede ser la exploración de un desacuerdo para aprender de las ideas del otro, concluyendo por resolver alguna condición que de otra forma los haría competir por los recursos o confrontándose para tratar de encontrar una solución.\n</p>\n <h1>COMPROMETER</h1>\n <p>\nSignifica un punto intermedio entre afirmación y cooperación. El objetivo en este caso es encontrar alguna solución adecuada y mutuamente aceptable que satisfaga parcialmente a ambas partes. Se encuentra también entre el competir y el complacer, al transigir se renuncia más que al competir, pero menos que al complacer. De la misma manera, al transigir las personas atacan un problema más directamente que cuando evaden, pero no lo exploran con tanta profundidad como cuando existe colaboración. Transigir puede significar dividir las diferencias, intercambiar concesiones o buscar una rápida postura intermedia.\n</p>\n<hr />\n<h1>LA INTERPRETACIÓN DE RESULTADOS</h1>\n<p>\nHabitualmente, después de recibir los resultados de cualquier prueba, la gente desea saber: ¿“Cuáles son las respuestas correctas?”. En el caso del comportamiento para manejar conflictos, no existe ninguna respuesta correcta y universal. Los cinco estilos son útiles en algunas situaciones: cada uno representa un conjunto de habilidades sociales sumamente útiles. Nuestro sentido común convencionalmente reconoce que con frecuencia “dos cabezas son mejor que una” (colaboración). Pero también nos dice, “hay que matar al enemigo con amabilidad “(complacer)”, “dividan las diferencias” (comprometerse), “no hay que involucrarse”, (evadir), “la fuerza vencerá” (compartir).\n</p>\n<p>\nLa efectividad de un estilo dado para el manejo de conflicto depende de los requerimientos de la situación específica y la habilidad con la cual se utilice el estilo. Cada uno de nosotros es capaz de aplicar los cinco estilos de manejar el conflicto: ninguno de nosotros puede decir que tiene solamente un único y rígido estilo para manejar el conflicto.\n</p>\n<p>\nSin embargo, cualquier persona emplea algunos estilos mejor que otros y por lo tanto, tiende a depender de aquellos que maneja mejor, ya sea debido a su temperamento o a su experiencia.\nPor lo tanto, el comportamiento que una persona manifiesta ante una situación es el resultado tanto de su predisposición personal como de las necesidades de la situación en la que se encuentra.\nEl instrumento para manejo de Conflicto de Thomas – Kilman está diseñado para evaluar esta combinación de estilos.\n</p>\n<p>\nCon el fin de ayudarle a evaluar que tan apropiado es en el uso de estos cinco estilos en sus situaciones. Se ha preparado una lista de varias aplicaciones para cada estilo. Su puntuación, ya sea alta o baja, puede simplemente indicar la utilidad de ese comportamiento en su situación. Sin embargo, también existe la posibilidad de que su habilidad social le conduzca a depender de algún manejo de conflicto más o menos de lo necesario. Con el fin de ayudarle a tomar esta determinación, también se ha listado algunas preguntas de diagnóstico que representan señales de advertencia para el uso excesivo o insuficiente de cada estilo.\n</p>', 'manejo_conflictos.jpg', 1, '0', 'El Modelo de Thomas Kilmann está diseñado para evaluar el comportamiento de las personas en situación de conflicto; es decir, los intereses de por lo menos dos personas, o partes, en enfrentamiento, que resultan incompatibles y requieren de la toma de decisiones para resolver dicha diferencia.\n\nEste esquema propone dos ejes con posiciones específicas: (1) la satisfacción de los propios intereses, que Kilmann denomina Afirmación y (2) satisfacer los intereses de los demás que Kilmann denomina Cooperación.', 'texto', NULL, NULL, 1, 1),
(7, 4, 'Estilos de Aprendizaje', NULL, 'estilos_aprendizaje.jpg', 0, '0', 'Los Estilos de Aprendizaje\nCada uno de los modos en que percibimos y procesamos (sintiendo y pensando, observando y haciendo), es un modo diferente de generar conocimiento y contribuir a nuestro aprendizaje. En sí, podemos pensar cada una de las cuatro etapas del ciclo como cuatro habilidades necesarias para aprender, las cuales serían:\nHabilidades para involucrarnos en experiencias concretas, manteniendo una actitud abierta y desprejuiciada al hacerlo;\nHabilidades para observar y reflexionar, comprendiendo situaciones desde diversos puntos de vista y estableciendo conexiones entre acciones y resultados;\nHabilidades para integrar observaciones y reflexiones en marcos más amplios de conocimiento, es decir, teorías, generalizaciones y conceptos;\nHabilidades para experimentar activamente con nuestras teorías, para aplicar en la práctica conceptos e ideas de manera activa.', 'texto', NULL, NULL, 1, 2),
(8, 2, 'Gestión del Tiempo', NULL, 'gestion-tiempo.jpg', 1, '0', 'La gestión del tiempo se refiere a la habilidad de administrar de manera efectiva nuestro tiempo para lograr nuestras metas y objetivos. Implica la planificación, organización y ejecución de tareas para minimizar el desperdicio de tiempo y maximizar la eficiencia.', 'texto', NULL, NULL, 1, 1),
(9, 5, 'Equipos de alto desempeño', NULL, 'equipo-alto-desempeno.png', 1, '0', 'El propósito principal de esta evaluación es proveer de un entendimiento de las fortalezas particulares del equipo y sus áreas para el desarrollo.', 'texto', NULL, NULL, 1, 1),
(10, NULL, 'DISC', NULL, 'disc1.jpg', NULL, NULL, NULL, NULL, NULL, NULL, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_usuario`
--

CREATE TABLE `evaluacion_usuario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `intentos` int(11) DEFAULT NULL,
  `ver_resultados` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `inicio` datetime DEFAULT NULL,
  `finalizacion` datetime DEFAULT NULL,
  `resultados` text DEFAULT NULL,
  `coach_id` int(11) DEFAULT NULL,
  `token_usuario` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `resultado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `evaluacion_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `faq`
--

CREATE TABLE `faq` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `pregunta` text DEFAULT NULL,
  `respuesta` text DEFAULT NULL,
  `orden` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `faq`
--

INSERT INTO `faq` (`id`, `categoria`, `pregunta`, `respuesta`, `orden`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'DIRECTORIO', '¿Cómo pertenecer al directorio de Coaches Profesionales?', '<ul>\n                    <li>Haz clic en la pestaña “Directorio” en el menú principal</li>\n                    <li>Ingresa tus datos personales y tu foto</li>\n                    <li>Selecciona tu institución de formación o sube tu certificación como Coach Profesional</li>\n                    <li>Haz clic en el botón [quiero pertenecer al directorio de Coaches Profesionales]</li>\n                </ul>', 0, NULL, NULL, 1),
(2, 'DIRECTORIO', '¿Qué necesito para pertenecer al directorio de Coach Certificados?', '<p>Para pertenecer al directorio tienes que estar certificado en un programa de formación acreditado por la ICA, o enviar tu certificación como Coach Profesional que cumpla con los estándares mínimos solicitados por la ICA:</p>\n                <ul>\n                    <li>Institución formadora legalmente constituida</li>\n                    <li>Mínimo 120 horas cronológicas de formación</li>\n                    <li>Al menos 50 horas sincrónicas o presenciales</li>\n                    <li>Un mínimo de 20 horas de práctica</li>\n                    <li>Al menos 10 horas de prácticas con retroalimentación de un mentor certificado</li>\n                    <li>Formación impartida por docentes que también sean Coaches certificados bajo los mismos estándares</li>\n                </ul>', 0, NULL, NULL, 1),
(3, 'DIRECTORIO', '¿Qué beneficios tengo por pertenecer al directorio de Coaches profesionales?', '<p>Pertenecer al directorio te permite:</p>\n                <ul>\n                    <li>Validar tu formación con respaldo internacional</li>\n                    <li>Aumentar tu visibilidad profesional</li>\n                    <li>Facilitar que potenciales clientes o instituciones te encuentren</li>\n                </ul>', 0, NULL, NULL, 1),
(4, 'CLIENTE', '¿Cómo crear un nuevo cliente?', '<p>\n                1. Haz clic en la pestaña “Clientes” en el menú principal<br>\n                2. Clic en el botón [nuevo]<br>\n                3. Ingresa la información de tu cliente.<br>\n                Para crear un nuevo cliente solo es indispensable el nombre.\n                </p>', 0, NULL, NULL, 1),
(5, 'CLIENTE', '¿Qué información puedo guardar de un cliente?', '<p>En la ficha de tu cliente puedes guardar toda la información que consideres relevante:</p>\n                <ul>\n                    <li>Nombre Completo</li>\n                    <li>E-mail</li>\n                    <li>Número telefónico</li>\n                    <li>Cédula o documento de identidad</li>\n                    <li>Grupo</li>\n                    <li>Fecha de nacimiento</li>\n                    <li>Tiempo en la compañía</li>\n                    <li>Tiempo en el cargo</li>\n                    <li>Dirección</li>\n                    <li>Información adicional relevante</li>\n                </ul>\n                <strong>Esta información es completamente confidencial.</strong>', 0, NULL, NULL, 1),
(6, 'CLIENTE', '¿Cómo puedo buscar un cliente?', '<p>\n                1. Haz clic en la pestaña “Clientes”<br>\n                2. Se abrirá una lista con todos los clientes creados<br>\n                3. Puedes buscarlo en el botón [Search]<br>\n                4. Haz clic en la pestaña “Datos” para abrir la ficha\n                </p>', 0, NULL, NULL, 1),
(7, 'TEST', '¿Cómo asignar un test a un cliente?', '<p>\n                1. Crea el cliente<br>\n                2. Ingresa a su ficha<br>\n                3. Selecciona la pestaña “Test”<br>\n                4. Haz clic en [asignar]<br>\n                5. Copia el enlace y envíalo al cliente\n                </p>\n                <p><strong>Estados del test:</strong></p>\n                <ul>\n                    <li>No iniciado</li>\n                    <li>En proceso</li>\n                    <li>Finalizado</li>\n                </ul>', 0, NULL, NULL, 1),
(8, 'TEST', '¿Cómo descargar el informe de un test en pdf?', '<p>\n                1. Abre el informe del test<br>\n                2. Haz clic en el ícono de descarga en la parte superior derecha\n                </p>', 0, NULL, NULL, 1),
(9, 'TEST', '¿Los clientes siempre pueden ver los resultados de sus test?', '<p>Tú decides si el cliente puede ver el informe o no.</p>\n                <ul>\n                    <li>Selecciona [permite ver el resultado al cliente]</li>\n                    <li>O no la selecciones</li>\n                </ul>\n                <strong>En ambos casos tú podrás ver el informe.</strong>', 0, NULL, NULL, 1),
(10, 'TEST', '¿Cómo buscar el informe de un test realizado por un cliente?', '<p>Opciones:</p>\n                <ul>\n                    <li>Desde la pestaña “Clientes”</li>\n                    <li>Desde la pestaña “Histórico”</li>\n                </ul>', 0, NULL, NULL, 1),
(11, 'DISC', '¿Cómo asignar un Test DISC a una persona?', '<p>\n                1. Crea el cliente<br>\n                2. Ingresa a su ficha<br>\n                3. Selecciona la pestaña “DISC”<br>\n                4. Haz clic en [Asignar]<br>\n                5. Copia el enlace y envíalo\n                </p>', 0, NULL, NULL, 1),
(12, 'HERRAMIENTAS', '¿Cómo aplicar una herramienta a un cliente?', '<p>\n                1. Crea el cliente<br>\n                2. Ingresa a su ficha<br>\n                3. Selecciona “Herramienta”<br>\n                4. Haz clic en [asignar]<br>\n                5. Copia el enlace y envíalo\n                </p>', 0, NULL, NULL, 1),
(13, 'SESIONES', '¿Cómo llevar la bitácora de sesiones de un cliente?', '<p>\n                1. Crea el cliente<br>\n                2. Ve a la pestaña “Sesiones”<br>\n                3. Haz clic en [Nueva sesión]<br>\n                4. Completa la información<br>\n                5. Usa el cronómetro para registrar el tiempo\n                </p>', 0, NULL, NULL, 1),
(14, 'SESIONES', '¿Puedo contabilizar el tiempo de una sesión de Coaching?', '<p>Sí.</p>\n                <p>Utiliza el cronómetro en la pestaña “Sesiones” y haz clic en [iniciar] y luego en [finalizar sesión].</p>', 0, NULL, NULL, 1),
(15, 'CLIENTE', '¿La información que ingreso a la plataforma es confidencial?', '<p>Toda la información ingresada en la plataforma de la ICA es <strong>completamente confidencial</strong>, según los términos y condiciones.</p>', 0, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramienta`
--

CREATE TABLE `herramienta` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `estado` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `herramienta`
--

INSERT INTO `herramienta` (`id`, `nombre`, `descripcion`, `fecha`, `foto`, `estado`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Cuadro de Metas', 'Esta herramienta invita al cliente a reflexionar sobre cuatro dimensiones esenciales de su vida o proyecto: lo que quiere, lo que no quiere, lo que tiene y lo que no tiene. Desde esta mirada integral, el cliente puede tomar consciencia de aquello que necesita cuidar, soltar, alcanzar y evitar, generando así una visión más clara de su realidad. El objetivo es facilitar decisiones más conscientes y alineadas con sus verdaderas metas y valores.', NULL, 'images/herramientas/cuadro_metas.png', 0, NULL, NULL, 1),
(2, 'FOAR para desarrollo de equipos', 'Es una herramienta de diagnóstico estratégico desde una mirada positiva y apreciativa, que invita a explorar junto al cliente sus Fortalezas, Oportunidades, Aspiraciones y Resultados en torno a un tema o desafío específico. A través de este enfoque, se promueve una toma de consciencia profunda sobre los recursos internos y externos que impulsan el crecimiento, favoreciendo una visión constructiva orientada al aprendizaje, la acción y el desarrollo sostenible.', NULL, 'images/herramientas/FOAR.png', 0, NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramienta_entidad`
--

CREATE TABLE `herramienta_entidad` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `herramienta_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `entidad_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `herramienta_entidad`
--

INSERT INTO `herramienta_entidad` (`id`, `fecha`, `created_at`, `updated_at`, `herramienta_id`, `estado_id`, `entidad_id`) VALUES
(1, '2024-06-11 17:06:10', NULL, NULL, 1, 1, 1),
(2, '2024-06-11 17:06:16', NULL, NULL, 1, 1, 2),
(3, '2024-06-11 17:06:24', NULL, NULL, 1, 1, 3),
(4, '2024-06-11 17:06:30', NULL, NULL, 1, 1, 4),
(5, '2024-06-12 13:03:29', NULL, NULL, 2, 1, 5),
(6, '2024-06-12 13:03:37', NULL, NULL, 2, 1, 6),
(7, '2024-06-12 13:03:43', NULL, NULL, 2, 1, 7),
(8, '2024-06-12 13:03:50', NULL, NULL, 2, 1, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `herramienta_usuario`
--

CREATE TABLE `herramienta_usuario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `herramienta_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `log_acceso`
--

CREATE TABLE `log_acceso` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membresia`
--

CREATE TABLE `membresia` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `valor_anual_usd` int(11) DEFAULT NULL,
  `valor_mensual_usd` int(11) DEFAULT NULL,
  `valor_anual_clp` int(11) DEFAULT NULL,
  `valor_mensual_clp` int(11) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `valor_anual_usd_miembro` int(11) DEFAULT NULL,
  `valor_mensual_usd_miembro` int(11) DEFAULT NULL,
  `cantidad_disc_incluidos` int(11) DEFAULT NULL,
  `descuento_anual_porcentaje` int(11) DEFAULT NULL,
  `cantidad_eval_incluidas` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `membresia`
--

INSERT INTO `membresia` (`id`, `descripcion`, `valor_anual_usd`, `valor_mensual_usd`, `valor_anual_clp`, `valor_mensual_clp`, `nombre`, `valor_anual_usd_miembro`, `valor_mensual_usd_miembro`, `cantidad_disc_incluidos`, `descuento_anual_porcentaje`, `cantidad_eval_incluidas`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Plan básico', 120, 12, 108000, 10800, 'Plan ICA Profesional', 100, 10, 5, 10, 10, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(2, 'Plan con asesoriamiento 24/7', 120, 12, 108000, 10800, 'Plan ICA Avanzado', 100, 10, 5, 10, 10, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(3, 'Plan Full', 120, 12, 108000, 10800, 'Plan ICA Premium', 100, 10, 5, 10, 10, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membresia_usuario`
--

CREATE TABLE `membresia_usuario` (
  `dia_pago_mes` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `id` bigint(20) UNSIGNED NOT NULL,
  `test_contratados` int(11) DEFAULT NULL,
  `disc_contratados` int(11) DEFAULT NULL,
  `herr_contratadas` int(11) DEFAULT NULL,
  `aplica_membresia` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `membresia_id` bigint(20) UNSIGNED DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2026_01_01_000001_create_estado_table', 1),
(2, '2026_01_01_000002_create_tipo_contenido_table', 1),
(3, '2026_01_01_000003_create_tipo_evaluacion_table', 1),
(4, '2026_01_01_000004_create_dimension_table', 1),
(5, '2026_01_01_000005_create_rol_usuario_table', 1),
(6, '2026_01_01_000006_create_empresa_table', 1),
(7, '2026_01_01_000007_create_membresia_table', 1),
(8, '2026_01_01_000008_create_permiso_table', 1),
(9, '2026_01_01_000009_create_entidad_table', 1),
(10, '2026_01_01_000010_create_herramienta_table', 1),
(11, '2026_01_01_000011_create_evaluacion_table', 1),
(12, '2026_01_01_000012_create_disc_codigo_table', 1),
(13, '2026_01_01_000013_create_disc_analisis_table', 1),
(14, '2026_01_01_000014_create_disc_instancia_table', 1),
(15, '2026_01_01_000015_create_faq_table', 1),
(16, '2026_01_01_000016_create_user_table', 1),
(17, '2026_01_01_000017_create_secciones_table', 1),
(18, '2026_01_01_000018_create_calculo_tabla_resultados_table', 1),
(19, '2026_01_01_000019_create_resultados_table', 1),
(20, '2026_01_01_000020_create_persona_table', 1),
(21, '2026_01_01_000021_create_preguntas_table', 1),
(22, '2026_01_01_000022_create_alternativas_table', 1),
(23, '2026_01_01_000023_create_evaluacion_usuario_table', 1),
(24, '2026_01_01_000024_create_respuestas_table', 1),
(25, '2026_01_01_000025_create_detalle_respuesta_table', 1),
(26, '2026_01_01_000026_create_membresia_usuario_table', 1),
(27, '2026_01_01_000027_create_permiso_usuario_table', 1),
(28, '2026_01_01_000028_create_herramienta_usuario_table', 1),
(29, '2026_01_01_000029_create_herramienta_entidad_table', 1),
(30, '2026_01_01_000030_create_atributo_table', 1),
(31, '2026_01_01_000031_create_sesion_table', 1),
(32, '2026_01_01_000032_create_actividad_table', 1),
(33, '2026_01_01_000033_create_log_acceso_table', 1),
(34, '2026_01_01_000034_create_tmp_usuarios_table', 1),
(35, '2026_02_19_000001_create_password_reset_tokens_table', 1),
(36, '2026_03_26_000001_create_categoria_table', 1),
(37, '2026_03_26_031029_create_biblioteca_table', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `codigo_permiso` varchar(255) DEFAULT NULL,
  `permiso` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso_usuario`
--

CREATE TABLE `permiso_usuario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `permiso_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fecha_nacimiento` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `grupo` varchar(255) DEFAULT NULL,
  `tiempo_compania` int(11) DEFAULT NULL,
  `tiempo_cargo` int(11) DEFAULT NULL,
  `rut` varchar(255) DEFAULT NULL,
  `owner` int(11) DEFAULT 0,
  `otra_informacion` varchar(255) DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `x_twitter` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `pagina_web` varchar(255) DEFAULT NULL,
  `observacion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `empresa_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id`, `fecha_nacimiento`, `telefono`, `direccion`, `grupo`, `tiempo_compania`, `tiempo_cargo`, `rut`, `owner`, `otra_informacion`, `pais`, `ciudad`, `linkedin`, `instagram`, `x_twitter`, `facebook`, `pagina_web`, `observacion`, `created_at`, `updated_at`, `estado_id`, `usuario_id`, `empresa_id`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-06 22:47:03', '2026-04-06 22:47:03', 1, 1, 1),
(2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 2, 1),
(3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 3, 1),
(4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 4, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas`
--

CREATE TABLE `preguntas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `enunciado` text DEFAULT NULL,
  `activo` int(11) DEFAULT 0,
  `numero` int(11) DEFAULT NULL,
  `tipo` int(11) DEFAULT 0,
  `inversa` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `dimension_id` bigint(20) UNSIGNED DEFAULT NULL,
  `seccion_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `evaluacion_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `preguntas`
--

INSERT INTO `preguntas` (`id`, `enunciado`, `activo`, `numero`, `tipo`, `inversa`, `created_at`, `updated_at`, `dimension_id`, `seccion_id`, `estado_id`, `evaluacion_id`) VALUES
(1, 'Últimamente tus colaboradores no responden a tu trato amistoso y a tu obvia preocupación por el bienestar de ellos. El rendimiento desciende rápidamente.', 0, 1, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(2, 'El rendimiento observable del grupo va en aumento. Te has asegurado de que todos los miembros sean conscientes de sus responsabilidades y de los niveles de rendimiento que de ellos se espera.', 0, 2, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(3, 'Los miembros de tu grupo no han podido solucionar un problema por sí solos. Normalmente los has dejado solos. El rendimiento del grupo y las relaciones interpersonales han sido buenas en el pasado.', 0, 3, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(4, 'Estás considerando un cambio. Tus colaboradores tienen todos excelentes antecedentes por sus logros. Ellos respetan la necesidad del cambio.', 0, 4, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(5, 'El rendimiento del grupo ha estado bajando en los últimos meses. Los miembros no se preocupan por lograr sus objetivos. La redefinición de los roles y responsabilidades ha ayudado en el pasado.\nSiempre has tenido que recordarles que tienen que cumplir sus tareas a tiempo.', 0, 5, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(6, 'Te has incorporado a una organización donde las operaciones son eficientes. Tu antecesor controlaba muy de cerca la situación. Tú quieres mantener una situación productiva, pero te gustaría comenzar a humanizar el ambiente.', 0, 6, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(7, 'Estás considerando algunos cambios importantes en la estructura organizativa. Los miembros del grupo han hecho sugerencias sobre la necesidad\nde cambio. El grupo ha sido productivo y ha demostrado flexibilidad en sus operaciones.', 0, 7, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(8, 'El rendimiento del grupo y sus relaciones interpersonales son buenas. Te sientes algo inseguro por la falta de dirección del grupo.\nTienes la impresión de que lo estás dirigiendo demasiado poco.', 0, 8, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(9, 'Has sido nombrado por tu superior jefe de un comité que ha tardado bastante en presentar sus recomendaciones respecto a la ejecución de ciertos cambios. El grupo además no sabe con claridad cuáles son sus objetivos.\nLa asistencia a las sesiones ha sido escasa. Sus reuniones se han convertido casi en tertulias sociales. Potencialmente tienen el talento necesario para ayudar.', 0, 9, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(10, 'Tus colaboradores, normalmente son capaces de responsabilizarse, pero no están respondiendo a tu reciente redefinición de niveles de calidad.', 0, 10, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(11, 'Has sido ascendido a un nuevo puesto. El jefe anterior no interfería en los asuntos del grupo. El grupo ha manejado bien sus tareas y la dirección.\nLas interrelaciones del grupo son buenas.', 0, 11, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(12, 'Información reciente indica que existen algunas dificultades internas entre tus colaboradores. El grupo tiene antecedentes notables por sus logros.\nLos miembros han logrado efectivamente objetivos de largo alcance. Han trabajado en armonía durante el año anterior. Todos están bien capacitados para la tarea.', 0, 12, 0, 0, NULL, NULL, NULL, 1, 1, 1),
(13, 'Un compañero de trabajo te está llamando con un apodo que te disgusta, tú…', 0, 1, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(14, 'Un amigo acaba llegar a cenar, pero una hora más tarde de lo que había dicho. No ha llamado para avisar que se retrasaría. Estás irritado por la tardanza… ¿qué haces?', 0, 2, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(15, 'Un compañero te da constantemente su trabajo para que lo hagas. Decides terminar con esta situación, ¿qué le dices?', 0, 3, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(16, 'Vas a un restaurante a cenar, cuando el mozo trae lo que has pedido, te das cuenta de que tu vaso está sucio… ¿Qué haces?', 0, 4, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(17, 'Estás en un larga fila para entrar al banco, llega un señor y se infiltra en la fila, delante de ti, tú…', 0, 5, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(18, 'Estás en un grupo haciendo un trabajo, tu propones una idea nueva para mejorar, sin embargo tu compañero (a) dice que está mal, que no sirves para nada, tú…', 0, 6, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(19, 'Estás en un cine viendo una película, de pronto suena el celular de una persona y contesta, ¿tú qué haces?', 0, 7, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(20, 'Estás en una fiesta, una persona te invita a bailar, sin embargo no me agrada su personalidad, ¿qué le dices?', 0, 8, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(21, 'Se han burlado de tu respuesta en una capacitación, tú…', 0, 9, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(22, 'Ves que un compañero está  permanentemente llegando retrasado', 0, 10, 0, 0, NULL, NULL, NULL, 2, 1, 2),
(23, 'Tratamos de tener procedimientos o protocolos que aseguren que las cosas están ordenadas y progresan sin incidentes (por ejemplo minimizar interrupciones, todos tienen la oportunidad de expresar su opinión).', 0, 1, 1, 0, NULL, NULL, 1, 3, 1, 3),
(24, 'Somos rápidos para ejecutar la tarea de turno y no gastamos mucho tiempo en la etapa de planeación.', 0, 2, 1, 0, NULL, NULL, 2, 3, 1, 3),
(25, 'Nuestro equipo siente que todos estamos en esto juntos y compartimos\nresponsabilidades por el éxito o fracaso.', 0, 3, 1, 0, NULL, NULL, 4, 3, 1, 3),
(26, 'Tenemos procedimientos minuciosos para ponernos de acuerdo en\nnuestros objetivos y planear la forma en que ejecutaremos nuestras labores.', 0, 4, 1, 0, NULL, NULL, 3, 3, 1, 3),
(27, 'Los miembros del equipo tienen miedo o no les gusta pedir ayuda a otros.', 0, 5, 1, 0, NULL, NULL, 1, 3, 1, 3),
(28, 'Tomamos los objetivos y metas de nuestro equipo literalmente, y\nasumimos un entendimiento compartido.', 0, 6, 1, 0, NULL, NULL, 3, 3, 1, 3),
(29, 'El líder del equipo trata de mantener el orden y contribuye con las labores del momento.', 0, 7, 1, 0, NULL, NULL, 2, 3, 1, 3),
(30, 'No tenemos procedimientos hechos, los inventamos con el avance de los\nproyectos.', 0, 8, 1, 0, NULL, NULL, 4, 3, 1, 3),
(31, 'Generamos muchas ideas, pero usamos muchas de ellas porque no las\nescuchamos y las rechazamos sin entenderlas completamente.', 0, 9, 1, 0, NULL, NULL, 2, 3, 1, 3),
(32, 'Los miembros del equipo no confían completamente entre ellos y monitorean de cerca a quienes están trabajando en tareas específicas.', 0, 10, 1, 0, NULL, NULL, 1, 3, 1, 3),
(33, 'El líder de equipo se asegura que todos seguimos lo procedimientos, no discutimos, no interrumpimos, y nos mantenemos enfocados.', 0, 11, 1, 0, NULL, NULL, 3, 3, 1, 3),
(34, 'Disfrutamos trabajando juntos, tenemos un tiempo productivo y divertido.', 0, 12, 1, 0, NULL, NULL, 4, 3, 1, 3),
(35, 'Nos hemos aceptado unos a otros como miembros del equipo.', 0, 13, 1, 0, NULL, NULL, 3, 3, 1, 3),
(36, 'El líder del equipo es democrático y colaborador.', 0, 14, 1, 0, NULL, NULL, 4, 3, 1, 3),
(37, 'Estamos tratando de definir la meta y qué tareas son necesarias para cumplirla.', 0, 15, 1, 0, NULL, NULL, 1, 3, 1, 3),
(38, 'Muchos de los miembros del equipo tienen sus propias ideas acerca del proceso y existen muchas agendas personales.', 0, 16, 1, 0, NULL, NULL, 2, 3, 1, 3),
(39, 'Aceptamos por completo las fortalezas y debilidades de cada uno de los\nmiembros del equipo.', 0, 17, 1, 0, NULL, NULL, 4, 3, 1, 3),
(40, 'Asignamos roles específicos a los miembros de equipo (líder de equipo,\nfacilitador, tomador de tiempo, secretario, etc.).', 0, 18, 1, 0, NULL, NULL, 1, 3, 1, 3),
(41, 'Tratamos de lograr armonía evitando el conflicto.', 0, 19, 1, 0, NULL, NULL, 3, 3, 1, 3),
(42, 'Las tareas son muy diferentes de lo que imaginábamos y parecen muy\ndifíciles de cumplir.', 0, 20, 1, 0, NULL, NULL, 2, 3, 1, 3),
(43, 'Hay muchas discusiones abstractas de los conceptos y temas, lo que hace que algunos miembros del equipo se impacienten con estas discusiones.', 0, 21, 1, 0, NULL, NULL, 1, 3, 1, 3),
(44, 'Somos capaces de resolver problemas de grupo.', 0, 22, 1, 0, NULL, NULL, 4, 3, 1, 3),
(45, 'Discutimos mucho pero nos ponemos de acuerdo con las cuestiones reales.', 0, 23, 1, 0, NULL, NULL, 2, 3, 1, 3),
(46, 'El equipo es a menudo tentado a salirse del alcance original del proyecto.', 0, 24, 1, 0, NULL, NULL, 3, 3, 1, 3),
(47, 'Expresamos críticas a los demás de forma constructiva.', 0, 25, 1, 0, NULL, NULL, 3, 3, 1, 3),
(48, 'Hay cariño por el equipo.', 0, 26, 1, 0, NULL, NULL, 4, 3, 1, 3),
(49, 'Parece que se logra muy poco con respecto a las metas del proyecto.', 0, 27, 1, 0, NULL, NULL, 1, 3, 1, 3),
(50, 'Las metas que hemos establecido no parecen realistas.', 0, 28, 1, 0, NULL, NULL, 2, 3, 1, 3),
(51, 'A pesar de que no estamos completamente seguros de las metas de los\nproyectos, estamos emocionados y orgullosos de estar en el equipo.', 0, 29, 1, 0, NULL, NULL, 1, 3, 1, 3),
(52, 'Con frecuencia compartimos problemas personales con los demás\nmiembros del equipo.', 0, 30, 1, 0, NULL, NULL, 3, 3, 1, 3),
(53, 'Hay mucha resistencia a ejecutar las tareas y mucha resistencia a las\npropuestas de mejoramiento de la calidad.', 0, 31, 1, 0, NULL, NULL, 2, 3, 1, 3),
(54, 'Logramos que mucho del trabajo se complete.', 0, 32, 1, 0, NULL, NULL, 4, 3, 1, 3),
(55, 'Si me doy cuenta de lo que el otro está por preguntar, me anticipo y le\ncontesto directamente, para ahorrar tiempo...', 0, 1, 2, 1, NULL, NULL, 5, 4, 1, 4),
(56, 'Mientras escucho a otra persona, me adelanto en el tiempo y me pongo\na pensar en lo que le voy a responder.', 0, 2, 2, 1, NULL, NULL, 6, 4, 1, 4),
(57, 'En general procuro centrarme en que está diciendo el otro, sin\nconsiderar cómo lo está diciendo...', 0, 3, 2, 1, NULL, NULL, 7, 4, 1, 4),
(58, 'Mientras estoy escuchando, digo cosas como mmmm. Entiendo... para\ndemostrar a la otra persona que le estoy prestando atención.', 0, 4, 2, 0, NULL, NULL, 8, 4, 1, 4),
(59, 'Creo que a la mayoría de las personas no le importa que las\ninterrumpa... siempre que las ayude en sus problemas.', 0, 5, 2, 1, NULL, NULL, 5, 4, 1, 4),
(60, 'Cuando escucho a algunas personas, mentalmente me pregunto ¿por\nqué les resultará tan difícil ir directamente al grano?', 0, 6, 2, 1, NULL, NULL, 6, 4, 1, 4),
(61, 'Cuando una persona realmente enojada expresa su molestia, yo\nsimplemente dejo que lo que dice “me entre por un oído y me salga por\nel otro”', 0, 7, 2, 1, NULL, NULL, 7, 4, 1, 4),
(62, 'Si no comprendo lo que una persona está diciendo, hago las preguntas\nnecesarias hasta entenderla.', 0, 8, 2, 0, NULL, NULL, 8, 4, 1, 4),
(63, 'Solamente discuto con una persona cuando sé positivamente que estoy\nen lo cierto.', 0, 9, 2, 1, NULL, NULL, 5, 4, 1, 4),
(64, 'Dado que he escuchado las mismas quejas y reclamos infinidad de veces,\ngeneralmente me dedico mentalmente a otra cosa mientras escucho.', 0, 10, 2, 1, NULL, NULL, 6, 4, 1, 4),
(65, 'El tono de la voz de una persona me dice, generalmente, mucho más\nque las palabras mismas.', 0, 11, 2, 0, NULL, NULL, 7, 4, 1, 4),
(66, 'Si una persona tiene dificultades en decirme algo, generalmente la\nayudo a expresarse.', 0, 12, 2, 0, NULL, NULL, 8, 4, 1, 4),
(67, 'Si no interrumpiera a las personas de vez en cuando, ellas ¡terminarían\nhablándome durante horas!', 0, 13, 2, 1, NULL, NULL, 5, 4, 1, 4),
(68, 'Cuando una persona me dice tantas cosas juntas, que siento superada\nmi capacidad para retenerlas, trato de poner mi mente en otra cosa para\nno alterarme.', 0, 14, 2, 1, NULL, NULL, 6, 4, 1, 4),
(69, 'Si una persona está muy enojada, lo mejor que puedo hacer es\nescucharla hasta que descargue toda su presión.', 0, 15, 2, 0, NULL, NULL, 7, 4, 1, 4),
(70, 'Si entiendo lo que una persona me acaba de decir, me parece\nredundante volver a preguntarle para verificar.', 0, 16, 2, 1, NULL, NULL, 8, 4, 1, 4),
(71, 'Cuando una persona está equivocada acerca de algún punto de su\nproblema, es importante interrumpirla y hacer que replantee ese punto\nde manera correcta.', 0, 17, 2, 1, NULL, NULL, 5, 4, 1, 4),
(72, 'Cuando he tenido un contacto negativo con una persona (discusión,\npelea...) no puedo evitar seguir pensando en ese episodio... aún después\nde haber iniciado un contacto con otra persona.', 0, 18, 2, 1, NULL, NULL, 6, 4, 1, 4),
(73, 'Cuando le respondo a las personas, lo hago en función de la manera en\nque percibo cómo ellas se sienten.', 0, 19, 2, 0, NULL, NULL, 7, 4, 1, 4),
(74, 'Si una persona no puede decirme exactamente que quiere de mí, no hay\nnada que yo pueda hacer.', 0, 20, 2, 1, NULL, NULL, 8, 4, 1, 4),
(75, 'No me gusta demasiado mi forma de ser.', 0, 1, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(76, 'Me interesan mucho los demás.', 0, 2, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(77, 'Me da la impresión de que la vida es muy satisfactoria.', 0, 3, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(78, 'Siento mucho cariño por casi todo el mundo.', 0, 4, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(79, 'Pocas veces me siento descansado cuando me levanto por la mañana.', 0, 5, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(80, 'No soy demasiado optimista con respecto al futuro.', 0, 6, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(81, 'Normalmente, casi todo me parece divertido.', 0, 7, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(82, 'Siempre me comprometo y me involucro.', 0, 8, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(83, 'La vida está bien.', 0, 9, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(84, 'No creo que el mundo sea un lugar agradable.', 0, 10, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(85, 'Río mucho.', 0, 11, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(86, 'Estoy bastante satisfecho con mi vida.', 0, 12, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(87, 'No me considero atractivo.', 0, 13, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(88, 'Considero que existe una brecha entre lo que querría hacer y lo que he hecho.', 0, 14, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(89, 'Soy muy feliz.', 0, 15, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(90, 'Encuentro belleza en algunas cosas.', 0, 16, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(91, 'Siempre produzco cierto efecto y contribuyo a la alegría en los demás.', 0, 17, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(92, 'Encuentro tiempo para todo lo que quiero hacer.', 0, 18, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(93, 'Me da la impresión de que, con frecuencia, no controlo demasiado mi vida.', 0, 19, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(94, 'Me siento capaz de enfrentarme a cualquier cosa.', 0, 20, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(95, 'Me siento muy despierto mentalmente.', 0, 21, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(96, 'A menudo me siento alegre y eufórico.', 0, 22, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(97, 'No me resulta fácil tomar decisiones.', 0, 23, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(98, 'Siento que mi vida no tiene un sentido ni un propósito determinado.', 0, 24, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(99, 'Me da la impresión de que tengo mucha energía.', 0, 25, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(100, 'Suelo influir de forma positiva en los acontecimientos.', 0, 26, 3, 0, NULL, NULL, NULL, 5, 1, 5),
(101, 'No suelo divertirme con los demás.', 0, 27, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(102, 'No me siento demasiado sano.', 0, 28, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(103, 'No tengo recuerdos demasiado felices del pasado.', 0, 29, 3, 1, NULL, NULL, NULL, 5, 1, 5),
(104, NULL, 0, 1, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(105, NULL, 0, 2, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(106, NULL, 0, 3, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(107, NULL, 0, 4, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(108, NULL, 0, 5, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(109, NULL, 0, 6, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(110, NULL, 0, 7, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(111, NULL, 0, 8, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(120, NULL, 0, 9, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(121, NULL, 0, 10, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(122, NULL, 0, 11, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(123, NULL, 0, 12, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(124, NULL, 0, 13, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(125, NULL, 0, 14, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(126, NULL, 0, 15, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(127, NULL, 0, 16, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(128, NULL, 0, 17, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(129, NULL, 0, 18, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(130, NULL, 0, 19, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(131, NULL, 0, 20, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(132, NULL, 0, 21, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(133, NULL, 0, 22, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(134, NULL, 0, 23, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(135, NULL, 0, 24, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(136, NULL, 0, 25, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(137, NULL, 0, 26, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(138, NULL, 0, 27, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(139, NULL, 0, 28, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(140, NULL, 0, 29, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(141, NULL, 0, 30, 0, 0, NULL, NULL, NULL, 6, 1, 6),
(142, 'Aprendo mejor:', 0, 1, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(143, 'Aprendo mejor:', 0, 2, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(144, 'Aprendo mejor:', 0, 3, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(145, 'Aprendo mejor:', 0, 4, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(146, 'Aprendo mejor:', 0, 5, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(147, 'Aprendo mejor:', 0, 6, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(148, 'Aprendo mejor:', 0, 7, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(149, 'Aprendo mejor:', 0, 8, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(150, 'Aprendo mejor:', 0, 9, 0, 0, NULL, NULL, NULL, 7, 1, 7),
(151, 'Soy capaz de controlar el tiempo que dedico a cada una de mis actividades', 0, 2, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(152, 'Se diferenciar lo importante de lo urgente', 0, 6, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(153, 'Soy capaz de identificar las tareas que puedo delegar y de hacer seguimiento a lo que delego', 0, 7, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(154, 'Se identificar con claridad las actividades que me roban o quitan el tiempo (ladrones del tiempo)', 0, 8, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(155, 'Dedico tiempo a los asuntos urgentes y se como hacerme cargo de ellos', 0, 9, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(156, 'Utilizo algún sistema de agenda para organizar mis actividades diarias, semanales y/o mensuales', 0, 10, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(157, 'Soy disciplinado y organizado con mi tiempo', 0, 11, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(158, 'Utilizo con moderación y conciencia las redes sociales', 0, 12, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(159, 'Dedico tiempo de mi día para organizar y planear mis actividades', 0, 1, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(160, 'Me fijo metas y objetivos y los escribo para hacer seguimiento', 0, 3, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(161, 'Tengo tiempo suficiente para realizar todas mis actividades, por lo que me siente tranquilo y sin estrés.', 0, 4, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(162, 'Soy capaz de reconoce claramente cuáles son las principales actividades que generar mayor valor a mi trabajo', 0, 5, 2, 0, NULL, NULL, NULL, 8, 1, 8),
(163, 'Los miembros del equipo admiten sus errores.', 0, 1, 1, 0, NULL, NULL, 22, 9, 1, 9),
(164, 'Los miembros del equipo se apasionan y bajan la guardia en la discusión de temas.', 0, 2, 1, 0, NULL, NULL, 23, 9, 1, 9),
(165, 'Los miembros del equipo están prestos a señalar las aportaciones y logros de los demás.', 0, 3, 1, 0, NULL, NULL, 26, 9, 1, 9),
(166, 'Las reuniones del equipo son interesantes y constructivas (no aburridas).', 0, 4, 1, 0, NULL, NULL, 23, 9, 1, 9),
(167, 'Durante las reuniones del equipo se discuten los temas mas importantes- y difíciles.', 0, 5, 1, 0, NULL, NULL, 23, 9, 1, 9),
(168, 'Los miembros del equipo reconocen las debilidades entre ellos.', 0, 6, 1, 0, NULL, NULL, 22, 9, 1, 9),
(169, 'Los miembros del equipo externan sus opiniones aun ante el riesgo de causar desacuerdos.', 0, 7, 1, 0, NULL, NULL, 23, 9, 1, 9),
(170, 'Los miembros del equipo se señalan uno al otro los comportamientos improductivos.', 0, 8, 1, 0, NULL, NULL, 25, 9, 1, 9),
(171, 'El equipo tiene reputación por su alto desempeño.', 0, 9, 1, 0, NULL, NULL, 26, 9, 1, 9),
(172, 'Los miembros del equipo piden ayuda sin dudarlo.', 0, 10, 1, 0, NULL, NULL, 22, 9, 1, 9),
(173, 'Los miembros del equipo salen de las reuniones con la confianza de que todos están comprometidos con las decisiones que acordaron.', 0, 11, 1, 0, NULL, NULL, 24, 9, 1, 9),
(174, 'Durante sus discusiones, los miembros del equipo se cuestionan el uno al otro sobre como llegaron a sus conclusiones y opiniones.', 0, 12, 1, 0, NULL, NULL, 23, 9, 1, 9),
(175, 'Los miembros del equipo se piden aportaciones el uno al otro sin importar su área de responsabilidad.', 0, 13, 1, 0, NULL, NULL, 22, 9, 1, 9),
(176, 'Cuando el equipo falla en lograr metas colectivas, cada miembro toma su responsabilidad personal para mejorar el desempeño del equipo.', 0, 14, 1, 0, NULL, NULL, 26, 9, 1, 9),
(177, 'Los miembros del equipo hacen voluntariamente sacrificios en sus áreas por el bien del equipo.', 0, 15, 1, 0, NULL, NULL, 26, 9, 1, 9),
(178, 'Los miembros del equipo son prontos a confrontar a sus colegas acerca de los problemas en sus respectivas áreas de responsabilidad.', 0, 16, 1, 0, NULL, NULL, 25, 9, 1, 9),
(179, 'Los miembros del equipo reconocen y aprovechan las habilidades y área de especialización el uno al otro.', 0, 17, 1, 0, NULL, NULL, 22, 9, 1, 9),
(180, 'Los miembros del equipo solicitan opiniones el uno al otro durante las reuniones.', 0, 18, 1, 0, NULL, NULL, 23, 9, 1, 9),
(181, 'Los miembros del equipo terminan sus discusiones con decisiones y medidas a tomar claras y especificas.', 0, 19, 1, 0, NULL, NULL, 24, 9, 1, 9),
(182, 'Los miembros del equipo se cuestionan el uno al otro sobre sus métodos y enfoques actuales.', 0, 20, 1, 0, NULL, NULL, 25, 9, 1, 9),
(183, 'El equipo se asegura que los que están desempeñando abajo del nivel sientan presión y la expectativa de que observen mejoría.', 0, 21, 1, 0, NULL, NULL, 25, 9, 1, 9),
(184, 'Los miembros del equipo voluntariamente se disculpan el uno con el otro.', 0, 22, 1, 0, NULL, NULL, 22, 9, 1, 9),
(185, 'Los miembros del equipo comunican opiniones impopulares con el grupo.', 0, 23, 1, 0, NULL, NULL, 23, 9, 1, 9),
(186, 'El equipo es claro acerca de su dirección y prioridades.', 0, 24, 1, 0, NULL, NULL, 24, 9, 1, 9),
(187, 'Los miembros del equipo no se muestran muy ávidos de que se les brinde reconocimiento por sus aportaciones propias.', 0, 25, 1, 0, NULL, NULL, 26, 9, 1, 9),
(188, 'Todos los miembros del equipo se sujetan a los mismos estándares elevados.', 0, 26, 1, 0, NULL, NULL, 25, 9, 1, 9),
(189, 'Cuando se presenta una confrontación, el equipo confronta y se ocupa del problema antes de pasar a otro tema.', 0, 27, 1, 0, NULL, NULL, 23, 9, 1, 9),
(190, 'El equipo esta alineado con respecto a objetivos comunes.', 0, 28, 1, 0, NULL, NULL, 24, 9, 1, 9),
(191, 'El equipo logra consistentemente sus objetivos.', 0, 29, 1, 0, NULL, NULL, 26, 9, 1, 9),
(192, 'El equipo es determinante aun cuando no cuenta con toda la información deseable.', 0, 30, 1, 0, NULL, NULL, 24, 9, 1, 9),
(193, 'Los miembros del equipo valoran mas el éxito colectivo que los logros personales.', 0, 31, 1, 0, NULL, NULL, 26, 9, 1, 9),
(194, 'Los miembros del equipo son honestos y sinceros el uno con el otro.', 0, 32, 1, 0, NULL, NULL, 22, 9, 1, 9),
(195, 'Los miembros del equipo platican el uno con el otro con comodidad acerca de sus vidas personales.', 0, 33, 1, 0, NULL, NULL, 22, 9, 1, 9),
(196, 'El equipo mantiene sus decisiones.', 0, 34, 1, 0, NULL, NULL, 24, 9, 1, 9),
(197, 'Los miembros del equipo consistentemente dan seguimiento a sus compromisos y promesas.', 0, 35, 1, 0, NULL, NULL, 25, 9, 1, 9),
(198, 'Los miembros del equipo brindan retroalimentación constructiva honesta el uno al otro.', 0, 36, 1, 0, NULL, NULL, 25, 9, 1, 9),
(199, 'Los miembros del equipo brindan poca importancia a los títulos y el status.', 0, 37, 1, 0, NULL, NULL, 26, 9, 1, 9),
(200, 'Los miembros del equipo apoyan las decisiones de grupo aun si inicialmente estaban en desacuerdo.', 0, 38, 1, 0, NULL, NULL, 24, 9, 1, 9),
(201, NULL, 0, 1, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(202, NULL, 0, 2, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(203, NULL, 0, 3, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(204, NULL, 0, 4, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(205, NULL, 0, 5, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(206, NULL, 0, 6, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(207, NULL, 0, 7, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(208, NULL, 0, 8, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(209, NULL, 0, 9, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(210, NULL, 0, 10, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(211, NULL, 0, 11, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(212, NULL, 0, 12, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(213, NULL, 0, 13, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(214, NULL, 0, 14, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(215, NULL, 0, 15, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(216, NULL, 0, 16, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(217, NULL, 0, 17, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(218, NULL, 0, 18, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(219, NULL, 0, 19, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(220, NULL, 0, 20, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(221, NULL, 0, 21, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(222, NULL, 0, 22, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(223, NULL, 0, 23, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(224, NULL, 0, 24, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(225, NULL, 0, 25, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(226, NULL, 0, 26, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(227, NULL, 0, 27, NULL, NULL, NULL, NULL, NULL, 10, 1, 10),
(228, NULL, 0, 28, NULL, NULL, NULL, NULL, NULL, 10, 1, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas`
--

CREATE TABLE `respuestas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `nro_intentos` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `evaluacion_usuario_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultados`
--

CREATE TABLE `resultados` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `resultado` text DEFAULT NULL,
  `minimo` int(11) DEFAULT NULL,
  `maximo` int(11) DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL,
  `es_promedio` int(11) DEFAULT NULL,
  `desigualdad_minimo` varchar(255) DEFAULT NULL,
  `desigualdad_maximo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `dimension_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `evaluacion_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

CREATE TABLE `rol_usuario` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rolusuario` varchar(255) DEFAULT NULL,
  `permisos` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`id`, `rolusuario`, `permisos`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Administrador', 'full', '2026-04-06 22:46:34', '2026-04-06 22:46:34', 1),
(2, 'Coach', 'view', '2026-04-06 22:46:34', '2026-04-06 22:46:34', 1),
(3, 'Cliente', 'view', '2026-04-06 22:46:34', '2026-04-06 22:46:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secciones`
--

CREATE TABLE `secciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre_seccion` varchar(255) DEFAULT NULL,
  `instrucciones` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `evaluacion_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `secciones`
--

INSERT INTO `secciones` (`id`, `nombre_seccion`, `instrucciones`, `created_at`, `updated_at`, `estado_id`, `evaluacion_id`) VALUES
(1, NULL, NULL, NULL, NULL, 1, 1),
(2, NULL, NULL, NULL, NULL, 1, 2),
(3, NULL, NULL, NULL, NULL, 1, 3),
(4, NULL, NULL, NULL, NULL, 1, 4),
(5, NULL, NULL, NULL, NULL, 1, 5),
(6, NULL, NULL, NULL, NULL, 1, 6),
(7, NULL, NULL, NULL, NULL, 1, 7),
(8, NULL, NULL, NULL, NULL, 1, 8),
(9, NULL, NULL, NULL, NULL, 1, 9),
(10, NULL, NULL, NULL, NULL, 1, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesion`
--

CREATE TABLE `sesion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre_sesion` text DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `segundos` int(11) DEFAULT NULL,
  `fecha_sesion` varchar(255) DEFAULT NULL,
  `cronometrado` int(11) DEFAULT NULL,
  `duracion` int(11) DEFAULT NULL,
  `fecha_hora_proxima_sesion` datetime DEFAULT NULL,
  `ultima_interaccion` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_contenido`
--

CREATE TABLE `tipo_contenido` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tipo_contenido` varchar(255) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipo_contenido`
--

INSERT INTO `tipo_contenido` (`id`, `tipo_contenido`, `orden`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'objetivo_general', 0, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(2, 'tema_sesion', 1, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(3, 'aspectos_importantes', 2, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(4, 'herramientas_utilizadas', 3, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(5, 'testimonio', 4, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1),
(6, 'compromisos', 5, '2026-04-06 22:46:35', '2026-04-06 22:46:35', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_evaluacion`
--

CREATE TABLE `tipo_evaluacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipo_evaluacion`
--

INSERT INTO `tipo_evaluacion` (`id`, `nombre`, `created_at`, `updated_at`, `estado_id`) VALUES
(1, 'Likert', NULL, NULL, 1),
(2, 'Ordenamiento', NULL, NULL, 1),
(3, 'DISC', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tmp_usuarios`
--

CREATE TABLE `tmp_usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `accion` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `usuario` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `disc_asignados` int(11) DEFAULT NULL,
  `acreditado` int(11) DEFAULT NULL,
  `eval_asignadas` int(11) DEFAULT NULL,
  `avatar_nombre_archivo` varchar(255) DEFAULT NULL,
  `avatar_es_fisico` varchar(255) DEFAULT NULL,
  `ruta_avatar` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `rolusuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `estado_id` bigint(20) UNSIGNED DEFAULT NULL,
  `empresa_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `nombre`, `usuario`, `email`, `password`, `status`, `disc_asignados`, `acreditado`, `eval_asignadas`, `avatar_nombre_archivo`, `avatar_es_fisico`, `ruta_avatar`, `remember_token`, `created_at`, `updated_at`, `rolusuario_id`, `estado_id`, `empresa_id`) VALUES
(1, 'Gonzalo Matus', 'mmatus0', 'matusgonzalo1544@gmail.com', '$2y$12$aV.Duo6epIbvAL/VgB2Mj.GIJVS5lqPFUg.SKCmU.WRZ14MHY8OAO', 1, 0, 0, 0, 'default_avatar.png', '1', 'images/users/default_avatar.png', NULL, '2026-04-06 22:47:03', '2026-04-06 22:47:03', 3, 1, 1),
(2, 'Administrador', 'admin', 'admin@evalcoach.cl', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 0, 0, 0, NULL, NULL, 'images/users/default_avatar.png', NULL, NULL, NULL, 1, 1, 1),
(3, 'Constanza Venegas', 'cony21', 'cony@gmail.com', '$2a$10$vnbY9BWQ4J5QyWaUEjrD3OnZt.SRTHdsXf8X2Mr0VOS9DLaE9kxF2', NULL, 0, 0, 0, NULL, NULL, 'images/users/default_avatar.png', NULL, NULL, NULL, 2, 1, 1),
(4, 'Alexander Ortega', 'alex1765', 'alexander@gmail.com', '$2a$10$AdRMkU/CvsBBGriQ4ZsYDOk.o9NOJMaCd3qAcnSe1dFFEXCqz4c5C', NULL, 0, 0, 0, NULL, NULL, 'images/users/default_avatar.png', NULL, NULL, NULL, 3, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `actividad_sesion_id_foreign` (`sesion_id`),
  ADD KEY `actividad_tipo_contenido_id_foreign` (`tipo_contenido_id`),
  ADD KEY `actividad_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `alternativas`
--
ALTER TABLE `alternativas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alternativas_evaluacion_id_foreign` (`evaluacion_id`),
  ADD KEY `alternativas_estado_id_foreign` (`estado_id`),
  ADD KEY `alternativas_pregunta_id_foreign` (`pregunta_id`);

--
-- Indices de la tabla `atributo`
--
ALTER TABLE `atributo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `atributo_herramienta_usuario_id_foreign` (`herramienta_usuario_id`),
  ADD KEY `atributo_estado_id_foreign` (`estado_id`),
  ADD KEY `atributo_entidad_id_foreign` (`entidad_id`);

--
-- Indices de la tabla `biblioteca`
--
ALTER TABLE `biblioteca`
  ADD PRIMARY KEY (`id`),
  ADD KEY `biblioteca_categoria_id_foreign` (`categoria_id`),
  ADD KEY `biblioteca_estado_id_foreign` (`estado_id`),
  ADD KEY `biblioteca_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `calculo_tabla_resultados`
--
ALTER TABLE `calculo_tabla_resultados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calculo_tabla_resultados_estado_id_foreign` (`estado_id`),
  ADD KEY `calculo_tabla_resultados_dimension_id_foreign` (`dimension_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `detalle_respuesta`
--
ALTER TABLE `detalle_respuesta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `detalle_respuesta_respuesta_id_foreign` (`respuesta_id`),
  ADD KEY `detalle_respuesta_estado_id_foreign` (`estado_id`),
  ADD KEY `detalle_respuesta_alternativa_id_foreign` (`alternativa_id`),
  ADD KEY `detalle_respuesta_pregunta_id_foreign` (`pregunta_id`);

--
-- Indices de la tabla `dimension`
--
ALTER TABLE `dimension`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dimension_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `disc_analisis`
--
ALTER TABLE `disc_analisis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disc_analisis_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `disc_codigo`
--
ALTER TABLE `disc_codigo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disc_codigo_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `disc_instancia`
--
ALTER TABLE `disc_instancia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `disc_instancia_disc_analisis_id_foreign` (`disc_analisis_id`),
  ADD KEY `disc_instancia_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresa_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `entidad`
--
ALTER TABLE `entidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `entidad_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluacion_estado_id_foreign` (`estado_id`),
  ADD KEY `evaluacion_tipo_evaluacion_id_foreign` (`tipo_evaluacion_id`);

--
-- Indices de la tabla `evaluacion_usuario`
--
ALTER TABLE `evaluacion_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluacion_usuario_usuario_id_foreign` (`usuario_id`),
  ADD KEY `evaluacion_usuario_resultado_id_foreign` (`resultado_id`),
  ADD KEY `evaluacion_usuario_estado_id_foreign` (`estado_id`),
  ADD KEY `evaluacion_usuario_evaluacion_id_foreign` (`evaluacion_id`);

--
-- Indices de la tabla `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faq_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `herramienta`
--
ALTER TABLE `herramienta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `herramienta_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `herramienta_entidad`
--
ALTER TABLE `herramienta_entidad`
  ADD PRIMARY KEY (`id`),
  ADD KEY `herramienta_entidad_herramienta_id_foreign` (`herramienta_id`),
  ADD KEY `herramienta_entidad_estado_id_foreign` (`estado_id`),
  ADD KEY `herramienta_entidad_entidad_id_foreign` (`entidad_id`);

--
-- Indices de la tabla `herramienta_usuario`
--
ALTER TABLE `herramienta_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `herramienta_usuario_usuario_id_foreign` (`usuario_id`),
  ADD KEY `herramienta_usuario_herramienta_id_foreign` (`herramienta_id`),
  ADD KEY `herramienta_usuario_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `log_acceso`
--
ALTER TABLE `log_acceso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `log_acceso_estado_id_foreign` (`estado_id`),
  ADD KEY `log_acceso_usuario_id_foreign` (`usuario_id`);

--
-- Indices de la tabla `membresia`
--
ALTER TABLE `membresia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `membresia_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `membresia_usuario`
--
ALTER TABLE `membresia_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `membresia_usuario_usuario_id_unique` (`usuario_id`),
  ADD KEY `membresia_usuario_membresia_id_foreign` (`membresia_id`),
  ADD KEY `membresia_usuario_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permiso_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `permiso_usuario`
--
ALTER TABLE `permiso_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `permiso_usuario_estado_id_foreign` (`estado_id`),
  ADD KEY `permiso_usuario_usuario_id_foreign` (`usuario_id`),
  ADD KEY `permiso_usuario_permiso_id_foreign` (`permiso_id`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD KEY `persona_estado_id_foreign` (`estado_id`),
  ADD KEY `persona_usuario_id_foreign` (`usuario_id`),
  ADD KEY `persona_empresa_id_foreign` (`empresa_id`);

--
-- Indices de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `preguntas_dimension_id_foreign` (`dimension_id`),
  ADD KEY `preguntas_seccion_id_foreign` (`seccion_id`),
  ADD KEY `preguntas_estado_id_foreign` (`estado_id`),
  ADD KEY `preguntas_evaluacion_id_foreign` (`evaluacion_id`);

--
-- Indices de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `respuestas_estado_id_foreign` (`estado_id`),
  ADD KEY `respuestas_evaluacion_usuario_id_foreign` (`evaluacion_usuario_id`);

--
-- Indices de la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resultados_dimension_id_foreign` (`dimension_id`),
  ADD KEY `resultados_estado_id_foreign` (`estado_id`),
  ADD KEY `resultados_evaluacion_id_foreign` (`evaluacion_id`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rol_usuario_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `secciones_estado_id_foreign` (`estado_id`),
  ADD KEY `secciones_evaluacion_id_foreign` (`evaluacion_id`);

--
-- Indices de la tabla `sesion`
--
ALTER TABLE `sesion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sesion_usuario_id_foreign` (`usuario_id`),
  ADD KEY `sesion_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `tipo_contenido`
--
ALTER TABLE `tipo_contenido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_contenido_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `tipo_evaluacion`
--
ALTER TABLE `tipo_evaluacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_evaluacion_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `tmp_usuarios`
--
ALTER TABLE `tmp_usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tmp_usuarios_usuario_id_foreign` (`usuario_id`),
  ADD KEY `tmp_usuarios_estado_id_foreign` (`estado_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_rolusuario_id_foreign` (`rolusuario_id`),
  ADD KEY `user_estado_id_foreign` (`estado_id`),
  ADD KEY `user_empresa_id_foreign` (`empresa_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `alternativas`
--
ALTER TABLE `alternativas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=307;

--
-- AUTO_INCREMENT de la tabla `atributo`
--
ALTER TABLE `atributo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `biblioteca`
--
ALTER TABLE `biblioteca`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `calculo_tabla_resultados`
--
ALTER TABLE `calculo_tabla_resultados`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `detalle_respuesta`
--
ALTER TABLE `detalle_respuesta`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `dimension`
--
ALTER TABLE `dimension`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `disc_analisis`
--
ALTER TABLE `disc_analisis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `disc_codigo`
--
ALTER TABLE `disc_codigo`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `disc_instancia`
--
ALTER TABLE `disc_instancia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `entidad`
--
ALTER TABLE `entidad`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `evaluacion`
--
ALTER TABLE `evaluacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `evaluacion_usuario`
--
ALTER TABLE `evaluacion_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `faq`
--
ALTER TABLE `faq`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `herramienta`
--
ALTER TABLE `herramienta`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `herramienta_entidad`
--
ALTER TABLE `herramienta_entidad`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `herramienta_usuario`
--
ALTER TABLE `herramienta_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `log_acceso`
--
ALTER TABLE `log_acceso`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `membresia`
--
ALTER TABLE `membresia`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `membresia_usuario`
--
ALTER TABLE `membresia_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permiso_usuario`
--
ALTER TABLE `permiso_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `preguntas`
--
ALTER TABLE `preguntas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=229;

--
-- AUTO_INCREMENT de la tabla `respuestas`
--
ALTER TABLE `respuestas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `resultados`
--
ALTER TABLE `resultados`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `secciones`
--
ALTER TABLE `secciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `sesion`
--
ALTER TABLE `sesion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_contenido`
--
ALTER TABLE `tipo_contenido`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tipo_evaluacion`
--
ALTER TABLE `tipo_evaluacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tmp_usuarios`
--
ALTER TABLE `tmp_usuarios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD CONSTRAINT `actividad_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `actividad_sesion_id_foreign` FOREIGN KEY (`sesion_id`) REFERENCES `sesion` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `actividad_tipo_contenido_id_foreign` FOREIGN KEY (`tipo_contenido_id`) REFERENCES `tipo_contenido` (`id`);

--
-- Filtros para la tabla `alternativas`
--
ALTER TABLE `alternativas`
  ADD CONSTRAINT `alternativas_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `alternativas_evaluacion_id_foreign` FOREIGN KEY (`evaluacion_id`) REFERENCES `evaluacion` (`id`),
  ADD CONSTRAINT `alternativas_pregunta_id_foreign` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`id`);

--
-- Filtros para la tabla `atributo`
--
ALTER TABLE `atributo`
  ADD CONSTRAINT `atributo_entidad_id_foreign` FOREIGN KEY (`entidad_id`) REFERENCES `entidad` (`id`),
  ADD CONSTRAINT `atributo_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `atributo_herramienta_usuario_id_foreign` FOREIGN KEY (`herramienta_usuario_id`) REFERENCES `herramienta_usuario` (`id`);

--
-- Filtros para la tabla `biblioteca`
--
ALTER TABLE `biblioteca`
  ADD CONSTRAINT `biblioteca_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `biblioteca_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `biblioteca_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `calculo_tabla_resultados`
--
ALTER TABLE `calculo_tabla_resultados`
  ADD CONSTRAINT `calculo_tabla_resultados_dimension_id_foreign` FOREIGN KEY (`dimension_id`) REFERENCES `dimension` (`id`),
  ADD CONSTRAINT `calculo_tabla_resultados_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `detalle_respuesta`
--
ALTER TABLE `detalle_respuesta`
  ADD CONSTRAINT `detalle_respuesta_alternativa_id_foreign` FOREIGN KEY (`alternativa_id`) REFERENCES `alternativas` (`id`),
  ADD CONSTRAINT `detalle_respuesta_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `detalle_respuesta_pregunta_id_foreign` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`id`),
  ADD CONSTRAINT `detalle_respuesta_respuesta_id_foreign` FOREIGN KEY (`respuesta_id`) REFERENCES `respuestas` (`id`);

--
-- Filtros para la tabla `dimension`
--
ALTER TABLE `dimension`
  ADD CONSTRAINT `dimension_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `disc_analisis`
--
ALTER TABLE `disc_analisis`
  ADD CONSTRAINT `disc_analisis_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `disc_codigo`
--
ALTER TABLE `disc_codigo`
  ADD CONSTRAINT `disc_codigo_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `disc_instancia`
--
ALTER TABLE `disc_instancia`
  ADD CONSTRAINT `disc_instancia_disc_analisis_id_foreign` FOREIGN KEY (`disc_analisis_id`) REFERENCES `disc_analisis` (`id`),
  ADD CONSTRAINT `disc_instancia_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD CONSTRAINT `empresa_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `entidad`
--
ALTER TABLE `entidad`
  ADD CONSTRAINT `entidad_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `evaluacion`
--
ALTER TABLE `evaluacion`
  ADD CONSTRAINT `evaluacion_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `evaluacion_tipo_evaluacion_id_foreign` FOREIGN KEY (`tipo_evaluacion_id`) REFERENCES `tipo_evaluacion` (`id`);

--
-- Filtros para la tabla `evaluacion_usuario`
--
ALTER TABLE `evaluacion_usuario`
  ADD CONSTRAINT `evaluacion_usuario_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `evaluacion_usuario_evaluacion_id_foreign` FOREIGN KEY (`evaluacion_id`) REFERENCES `evaluacion` (`id`),
  ADD CONSTRAINT `evaluacion_usuario_resultado_id_foreign` FOREIGN KEY (`resultado_id`) REFERENCES `resultados` (`id`),
  ADD CONSTRAINT `evaluacion_usuario_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `faq`
--
ALTER TABLE `faq`
  ADD CONSTRAINT `faq_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `herramienta`
--
ALTER TABLE `herramienta`
  ADD CONSTRAINT `herramienta_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `herramienta_entidad`
--
ALTER TABLE `herramienta_entidad`
  ADD CONSTRAINT `herramienta_entidad_entidad_id_foreign` FOREIGN KEY (`entidad_id`) REFERENCES `entidad` (`id`),
  ADD CONSTRAINT `herramienta_entidad_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `herramienta_entidad_herramienta_id_foreign` FOREIGN KEY (`herramienta_id`) REFERENCES `herramienta` (`id`);

--
-- Filtros para la tabla `herramienta_usuario`
--
ALTER TABLE `herramienta_usuario`
  ADD CONSTRAINT `herramienta_usuario_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `herramienta_usuario_herramienta_id_foreign` FOREIGN KEY (`herramienta_id`) REFERENCES `herramienta` (`id`),
  ADD CONSTRAINT `herramienta_usuario_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `log_acceso`
--
ALTER TABLE `log_acceso`
  ADD CONSTRAINT `log_acceso_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `log_acceso_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `membresia`
--
ALTER TABLE `membresia`
  ADD CONSTRAINT `membresia_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `membresia_usuario`
--
ALTER TABLE `membresia_usuario`
  ADD CONSTRAINT `membresia_usuario_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `membresia_usuario_membresia_id_foreign` FOREIGN KEY (`membresia_id`) REFERENCES `membresia` (`id`),
  ADD CONSTRAINT `membresia_usuario_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD CONSTRAINT `permiso_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `permiso_usuario`
--
ALTER TABLE `permiso_usuario`
  ADD CONSTRAINT `permiso_usuario_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `permiso_usuario_permiso_id_foreign` FOREIGN KEY (`permiso_id`) REFERENCES `permiso` (`id`),
  ADD CONSTRAINT `permiso_usuario_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `persona`
--
ALTER TABLE `persona`
  ADD CONSTRAINT `persona_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id`),
  ADD CONSTRAINT `persona_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `persona_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `preguntas`
--
ALTER TABLE `preguntas`
  ADD CONSTRAINT `preguntas_dimension_id_foreign` FOREIGN KEY (`dimension_id`) REFERENCES `dimension` (`id`),
  ADD CONSTRAINT `preguntas_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `preguntas_evaluacion_id_foreign` FOREIGN KEY (`evaluacion_id`) REFERENCES `evaluacion` (`id`),
  ADD CONSTRAINT `preguntas_seccion_id_foreign` FOREIGN KEY (`seccion_id`) REFERENCES `secciones` (`id`);

--
-- Filtros para la tabla `respuestas`
--
ALTER TABLE `respuestas`
  ADD CONSTRAINT `respuestas_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `respuestas_evaluacion_usuario_id_foreign` FOREIGN KEY (`evaluacion_usuario_id`) REFERENCES `evaluacion_usuario` (`id`);

--
-- Filtros para la tabla `resultados`
--
ALTER TABLE `resultados`
  ADD CONSTRAINT `resultados_dimension_id_foreign` FOREIGN KEY (`dimension_id`) REFERENCES `dimension` (`id`),
  ADD CONSTRAINT `resultados_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `resultados_evaluacion_id_foreign` FOREIGN KEY (`evaluacion_id`) REFERENCES `evaluacion` (`id`);

--
-- Filtros para la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD CONSTRAINT `rol_usuario_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `secciones`
--
ALTER TABLE `secciones`
  ADD CONSTRAINT `secciones_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `secciones_evaluacion_id_foreign` FOREIGN KEY (`evaluacion_id`) REFERENCES `evaluacion` (`id`);

--
-- Filtros para la tabla `sesion`
--
ALTER TABLE `sesion`
  ADD CONSTRAINT `sesion_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `sesion_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `tipo_contenido`
--
ALTER TABLE `tipo_contenido`
  ADD CONSTRAINT `tipo_contenido_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `tipo_evaluacion`
--
ALTER TABLE `tipo_evaluacion`
  ADD CONSTRAINT `tipo_evaluacion_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`);

--
-- Filtros para la tabla `tmp_usuarios`
--
ALTER TABLE `tmp_usuarios`
  ADD CONSTRAINT `tmp_usuarios_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `tmp_usuarios_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_empresa_id_foreign` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id`),
  ADD CONSTRAINT `user_estado_id_foreign` FOREIGN KEY (`estado_id`) REFERENCES `estado` (`id`),
  ADD CONSTRAINT `user_rolusuario_id_foreign` FOREIGN KEY (`rolusuario_id`) REFERENCES `rol_usuario` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
