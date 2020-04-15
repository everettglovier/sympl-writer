export class Script {
  public scenes: any = [];
  // Generate a unique ID
  public static generateId(): string {
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += CHARS.charAt(
        Math.floor(Math.random() * CHARS.length )
      );
    }
    return autoId;
  }
  // File to string
  public static fileToString( file: File ) {
    return new Promise<string>( resolve => {
      const reader: any = new FileReader();
      reader.readAsText( file );
      reader.onload = () => {
        resolve( reader.result );
      };
    });
  }
  // A delta is quill's proprietary editing format
  public static toDelta( scenes ) {
    const ops = [];
    for ( const scene of scenes ) {
      if ( scene.heading ) {
        ops.push({ insert: scene.heading });
        const attributes: any = {};
        attributes.heading = true;
        attributes.key = scene.key || Script.generateId();
        ops.push({attributes, insert: '\n'});
      }
      for ( const content of scene.content ) {
        ops.push({insert: content.text});
        const attributes: any = {};
        attributes[content.type] = true;
        attributes.key = content.key || Script.generateId();
        ops.push({attributes, insert: '\n'});
      }
    }
    return { ops };
  }
  public static importDelta( delta ) {
    console.log('Converting delta to scenes...', delta);
    const scenes: any = [{
      heading: false,
      content: []
    }];
    let content: any = { type: '', text: '', annotations: [] };
    for ( const op of delta.ops ) {
      console.log( op );
      if ( op.attributes ) {
        for ( const att in op.attributes ) {
          switch ( att ) {
            case 'heading':
            case 'action':
            case 'dialogue':
            case 'parenthetical':
            case 'shot':
            case 'transition':
            case 'character':
              content.type = att;
              break;
            case 'bold':
            case 'italic':
              content.annotations.push({ type: att, index: content.text.length, length: op.insert.length });
              break;
            case 'element':
              content.annotations.push({ type: 'element', index: content.text.length, length: op.insert.length, key: op.attributes.key || Script.generateId() });
              break;
            case 'key':
              content.key = op.attributes[ att ];
              break;
            default:
              content.type = 'general';
          }
        }
      }
      if ( op.insert && op.insert === '\n' ) {
        if ( content.type === 'heading' ) {
          scenes.push({ heading: content.text, content: [] });
        } else {
          scenes[scenes.length - 1].content.push(content);
        }
        content = {type: '', text: '', annotations: []};
      } else if ( op.insert ) {
        content.text += op.insert;
      }
    }
    return scenes;
  }
  public static async importFDX( file: File ) {
    const fileString = await Script.fileToString( file );
    const parser = new DOMParser();
    const xml = parser.parseFromString( fileString, 'text/xml');
    const paragraphs = xml.getElementsByTagName('Paragraph');
    if ( !paragraphs || paragraphs.length < 1 ) { return false; }
    const scenes: any = [{
      heading: false,
      content: []
    }];
    for ( const p in paragraphs ) {
      let text = '';
      for (const c in paragraphs[p].children) {
        if ( paragraphs[p].children[c].nodeName &&  paragraphs[p].children[c].nodeName.toLowerCase() === 'text') {
          text += paragraphs[p].children[c].innerHTML;
        }
      }
      let attribute = '';
      try { attribute = paragraphs[p].getAttribute('Type'); } catch (e) {}
      if ( text ) {
        switch (attribute) {
          case 'Scene Heading':
            scenes.push({heading: text.toUpperCase(), key: Script.generateId(), content: []});
            break;
          case 'General':
          case 'Dialogue':
          case 'Character':
          case 'Action':
          case 'Shot':
          case 'Parenthetical':
          case 'Transition':
            const att = attribute ? attribute.toLowerCase().replace(' ', '') : 'action';
            scenes[scenes.length - 1].content.push({type: att, text, key: Script.generateId()});
            break;
          default:
            scenes[scenes.length - 1].content.push({type: 'general', text, key: Script.generateId()});
        }
      }
    }
    return scenes;
  }
}
