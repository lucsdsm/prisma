from .context import usuario_atual


class UsuarioAtualMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        usuario = getattr(request, "user", None)

        if not usuario or not usuario.is_authenticated:
            usuario = None

        token = usuario_atual.set(usuario)

        try:
            return self.get_response(request)
        finally:
            usuario_atual.reset(token)