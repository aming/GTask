all: run

run: compile
	palm-install -r info.xming.gtask
	palm-install `ls *ipk`
	palm-launch info.xming.gtask

compile:
	palm-package gtask.package gtask.application gtask.service

clean:
	@rm -rf *ipk
