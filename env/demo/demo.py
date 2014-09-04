from fabric.api import env
from deployit.fabrichelper.servicebase import FlaskUwsgiService, FlaskNginxService
from deployit.fabrichelper.environments import EnvTask


class DemoEnv(EnvTask):
    """
    Use demo environment
    """
    name = "demo"

    def run(self):
        env.hosts = ['gurten.iterativ.ch']
        env.env_name = 'demo'
        env.services = [FlaskUwsgiService, FlaskNginxService]
        env.project_name = 'pdfoffline'
        env.remote_virtualenv = '/srv/www/pdfoffline/demo/pdfoffline-env'
        env.server_names = ['pdfoffline.iterativ.ch']
        env.nginx_no_follow = True
        env.requirements_file = 'requirements/base.pip'
        env.puppet_branch_name = 'ubuntu1204'


demo_env = DemoEnv()
