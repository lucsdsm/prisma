from contextvars import ContextVar


usuario_atual = ContextVar("usuario_atual", default=None)


def get_usuario_atual():
    return usuario_atual.get()