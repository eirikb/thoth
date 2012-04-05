test:
	./node_modules/.bin/mocha \
	--timeout 30000 \
	--reporter list

.PHONY: test
