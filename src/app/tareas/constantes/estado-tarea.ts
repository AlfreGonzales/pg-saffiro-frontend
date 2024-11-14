export enum EstadoTarea {
    NUEVA = 'nueva',
    APROBADA = 'aprobada',
    EN_CURSO = 'en curso',
    CALIDAD = 'calidad',
    CERTIFICACION = 'certificacion',
    ACABADA = 'acabada',
    POSTERGADA = 'postergada',
    CANCELADA = 'cancelada'
}

export const ColoresEstadoTarea = new Map<string, string[]>([
    [EstadoTarea.NUEVA, ['var(--green-100)', 'var(--green-400)']],
    [EstadoTarea.APROBADA, ['var(--purple-100)', 'var(--purple-400)']],
    [EstadoTarea.EN_CURSO, ['var(--yellow-100)', 'var(--yellow-400)']],
    [EstadoTarea.CALIDAD, ['var(--blue-100)', 'var(--blue-400)']],
    [EstadoTarea.CERTIFICACION, ['var(--orange-100)', 'var(--orange-400)']],
    [EstadoTarea.ACABADA, ['var(--teal-100)', 'var(--teal-400)']],
    [EstadoTarea.POSTERGADA, ['var(--gray-100)', 'var(--gray-400)']],
    [EstadoTarea.CANCELADA, ['var(--red-100)', 'var(--red-400)']]
]);

export const NombreColumna = new Map<number, string>([
    [0, 'Nuevas'],
    [1, 'Aprobadas'],
    [2, 'En curso'],
    [3, 'Calidad'],
    [4, 'Certificación'],
    [5, 'Acabadas']
]);
