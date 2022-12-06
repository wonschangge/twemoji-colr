NPM        ?= npm
NODE       ?= node
PERL       ?= perl
# PYTHON     ?= python3
PYTHON     ?= fontforge -lang=py -script
TTX        ?= ttx
ZIP				 ?= zip

# FONT_NAME  = Twemoji\ Mozilla
FONT_NAME  = star-icons

BUILD_DIR  = build

FINAL_TARGET = $(BUILD_DIR)/$(FONT_NAME).ttf

TEST_HTML = FONT_NAME=${FONT_NAME} ${NODE} generateTestHTML.js

# SVGS         = twe-svg.zip
# SVGS         = twe-svg-only-one.zip # JUST TEST
SVGS         = star-icons.zip
OVERRIDE_DIR = overrides
EXTRA_DIR    = extras

# TEST FONT GENERATION
ENABLE_LAYERS_LIGATURE = 0

GRUNTFILE  = Gruntfile.js
LAYERIZE   = layerize.js

CODEPOINTS          = $(BUILD_DIR)/codepoints.json
OT_SOURCE  	        = $(BUILD_DIR)/$(FONT_NAME).ttx
RAW_FONT            = $(BUILD_DIR)/raw-font/$(FONT_NAME).ttf
RAW_FONT_TEMPORARY	= $(BUILD_DIR)/raw-font/$(FONT_NAME).temporary.ttf

$(FINAL_TARGET) : $(RAW_FONT) $(OT_SOURCE)
	rm -f $(FINAL_TARGET)
# remove illegal <space> from the PostScript name in the font
	$(TTX) -t name -o $(RAW_FONT).names $(RAW_FONT)
	$(PERL) -i -e 'my $$ps = 0;' \
	        -e 'while(<>) {' \
	        -e '  $$ps = 1 if m/nameID="6"/;' \
	        -e '  $$ps = 0 if m|</namerecord>|;' \
	        -e '  s/Twemoji Mozilla/TwemojiMozilla/ if $$ps;' \
	        -e '  print;' \
	        -e '}' $(RAW_FONT).names
	$(TTX) -m $(RAW_FONT) -o $(RAW_FONT_TEMPORARY) $(RAW_FONT).names
	$(PYTHON) fixDirection.py $(RAW_FONT_TEMPORARY)
	$(TTX) -m $(RAW_FONT_TEMPORARY) -o $(FINAL_TARGET) $(OT_SOURCE)
	$(TEST_HTML)

$(RAW_FONT) : $(CODEPOINTS) $(GRUNTFILE)
	FONT_NAME=${FONT_NAME} $(NPM) run grunt webfont

$(CODEPOINTS) $(OT_SOURCE) : $(LAYERIZE) $(SVGS) $(OVERRIDE_DIR) $(EXTRA_DIR)
	ENABLE_LAYERS_LIGATURE=${ENABLE_LAYERS_LIGATURE} $(NODE) $(LAYERIZE) $(SVGS) $(OVERRIDE_DIR) $(EXTRA_DIR) $(BUILD_DIR) $(FONT_NAME)

$(SVGS) :
	ifneq [ -f $(SVGS) ]; then ${ZIP} -r ${FONT_NAME}.zip ${FONT_NAME}; fi

test :
	$(TEST_HTML)

clean:
	rm -rf build/
	rm -f star-icons.zip
	make $(FINAL_TARGET)
