TESTS = test/*.js
REPORTER = dot

all: test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 30000
		$(TESTS)

.PHONY: test
